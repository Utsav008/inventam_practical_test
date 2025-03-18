let express = require("express");
let route = express.Router();

const data = require('../../data.json');

//point A
route.get("/getAverageBudget", (req,res) => {
    const marketingData = data.departments.find(d => d.name === "Marketing");
    
    const activeCampaigns = marketingData.teams.flatMap(team => team.campaigns).filter(c => c.active);
    const avgBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0) / activeCampaigns.length || 0;
    res.json({ averageBudget: avgBudget });

});

//point B
route.get('/getCompletedProjects', (req, res) => {
    const engineeringDept = data.departments.find(d => d.name === "Engineering");

    const completedProjects = engineeringDept.teams.flatMap(team => team.projects).filter(p => p.completed);
    res.json({ completedProjects });
});

//point C
route.get('/getTopManager', async (req, res) => {
    let managerStats = {};
    
    let lowestBudgetAmount = await getLowestBudgetAmount()
    data.departments.forEach(dept => {
        dept.teams.forEach(team => {
            const manager = team.lead.name;
            const runningProjects = team.projects ? team.projects.filter(p => !p.completed) : [];
            const activeCampaigns = team.campaigns ? team.campaigns.filter(c => c.active) : [];
            
            const highBudgetCount = [...runningProjects, ...activeCampaigns].filter(item => item.budget > lowestBudgetAmount).length;
            
            if (!managerStats[manager]) {
                managerStats[manager] = { count: 0, highBudget: 0 };
            }
            managerStats[manager].count += runningProjects.length + activeCampaigns.length;
            managerStats[manager].highBudget += highBudgetCount;
        });
    });

    const topManager = Object.entries(managerStats).sort((a, b) => b[1].count - a[1].count || b[1].highBudget - a[1].highBudget)[0][0];
    res.json({ topManager });
});

//point D
route.get('/getSameTeamProjects', (req, res) => {
    let teamMap = {};
    data.departments.forEach(dept => {
        dept.teams.forEach(team => {
            team.projects?.forEach(project => {
                const key = project.team_members.sort().join(',');
                if (!teamMap[key]) teamMap[key] = [];
                teamMap[key].push(project.name);
            });
        });
    });
    
    const duplicateTeams = Object.values(teamMap).filter(names => names.length > 1);
    res.json({ projects: duplicateTeams });
});

function getLowestBudgetAmount(){
    let activeEntities = [];
    data.departments.forEach(dept => {
        dept.teams.forEach(team => {
            if (team.projects) {
                activeEntities = activeEntities.concat(team.projects.filter(p => !p.completed));
            }
            if (team.campaigns) {
                activeEntities = activeEntities.concat(team.campaigns.filter(c => c.active));
            }
        });
    });
    
    if (activeEntities.length === 0) return res.json({ message: "No active projects or campaigns found" });
    const lowestBudgetEntity = activeEntities.reduce((min, entity) => entity.budget < min.budget ? entity : min, activeEntities[0]);
    return lowestBudgetEntity.budget;
}

module.exports = route;


