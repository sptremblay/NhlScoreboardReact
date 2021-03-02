
const ls = require('local-storage');

export const Configuration = {
    getPrefferedTeams(){
        return ls.get('PrefferedTeams');
    },
    setPrefferedTeams(teams){
        ls.set('PrefferedTeams', teams);
    }
}
