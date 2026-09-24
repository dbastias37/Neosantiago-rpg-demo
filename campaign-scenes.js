"use strict";
// Stable identifiers belong to authored scenes. This frozen order describes the
// V0.2/V0.3 numeric saves; future insertions must never edit this table.
var NeoCampaignScenes=(function(){
  var legacyIds=Object.freeze([
    "d1-signal","d1-council","d1-gate","d1-ration","d1-red-lights","d1-flood","d1-camp","d1-pump","d1-matias",
    "d2-drone-pulse","d2-republica","d2-alameda","d2-safe-house","d2-node14","d2-identity","d2-exposed-core","d2-pulse-hunters","d2-vera",
    "d3-avenue","d3-purple-cordon","d3-drone-nest","d3-dead-without-core","d3-continuity-door","d3-last-patrol","d3-irene","d3-exiles","d3-truth"
  ]);
  var originalRoute=Object.freeze([0,2,8,9,13,17,18,23,26]);
  function validate(catalog){
    if(!Array.isArray(catalog)||!catalog.length)throw Error("Catálogo de escenas vacío");
    var seen=new Set();catalog.forEach(function(ev){
      if(!ev||typeof ev.id!=="string"||!/^d[1-9][0-9]*-[a-z0-9-]+$/.test(ev.id)||seen.has(ev.id))throw Error("Identificador de escena ausente o duplicado");
      seen.add(ev.id);
    });
    if(legacyIds.some(function(id){return !seen.has(id)}))throw Error("Escena legada eliminada: se necesita migración explícita");
    return true;
  }
  function index(catalog,id){return catalog.findIndex(function(ev){return ev.id===id})}
  function resolve(catalog,saved){
    if(!saved||!Number.isInteger(saved.index)||saved.index<0)return -1;
    var id;
    if(saved.sceneId!==undefined){
      if(typeof saved.sceneId!=="string")return -1;
      id=saved.sceneId;
    }else{
      var prior=saved.campaignRevision? saved.index:originalRoute[saved.index];
      id=legacyIds[prior];
    }
    return id===undefined?-1:index(catalog,id);
  }
  return Object.freeze({legacyIds:legacyIds,validate:validate,index:index,resolve:resolve,
    at:function(catalog,position,id){return !!catalog[position]&&catalog[position].id===id},
    past:function(catalog,position,id){var target=index(catalog,id);return target<0||position>target}
  });
})();
NeoCampaignScenes.validate(CAMPAIGN_EVENTS);
