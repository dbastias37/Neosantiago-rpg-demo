// Combat/economy/network unit scenarios start with established contacts. No paid
// receipt, XP or reward is invented. Fresh-game discovery has its own end-to-end tests.
exports.connectedWorld=function(E,data,options){const w=E.createWorld(data,options);w.progression.known=Object.keys(data.missions);return w;};

// Unit scenarios may place an established team at a named assignment's origin.
// This is fixture setup only; progression/transfer integration tests travel in-engine.
exports.atOrigin=function(data,w,id){const placed=structuredClone(w);placed.location=data.routes[data.missions[id].route].nodes[0];return placed;};
