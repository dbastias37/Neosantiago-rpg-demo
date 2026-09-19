// Combat/economy/network unit scenarios start with established contacts. No paid
// receipt, XP or reward is invented. Fresh-game discovery has its own end-to-end tests.
exports.connectedWorld=function(E,data,options){const w=E.createWorld(data,options);w.progression.known=Object.keys(data.missions);return w;};
