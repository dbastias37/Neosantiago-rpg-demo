/* Shared, pure receipt contract. Optional fields leave existing saves untouched. */
(function(root){
  'use strict';
  var copy=function(x){return JSON.parse(JSON.stringify(x))};
  function need(ok,text){if(!ok)throw Error(text||'Registro de la reserva médica inválido.')}
  function id(x){return typeof x==='string'&&/^[a-zA-Z0-9_-]{8,96}$/.test(x)}
  function request(x){
    need(x&&x.version===1&&id(x.requestId)&&(x.variant==='A'||x.variant==='B'));
    need(['requested','delivered','reviewed'].indexOf(x.stage)>=0&&typeof x.delegated==='boolean');
    need(x.courierId===null||id(x.courierId));
    need(x.source===null||['direct','rescue'].indexOf(x.source)>=0);
    need(x.stage==='requested'?x.source===null&&x.courierId===null:x.source!==null&&x.courierId!==null);
    return x;
  }
  function cargo(x){
    need(x&&x.version===1&&id(x.requestId)&&id(x.courierId));
    need(['requested','collected','delivered'].indexOf(x.stage)>=0);
    need(x.stage==='requested'?x.source===null:['direct','rescue'].indexOf(x.source)>=0);
    need(x.stage==='delivered'?x.recipient==='Posta de Los Héroes':x.recipient===null);
    return x;
  }
  function create(requestId,variant){return copy(request({version:1,requestId:requestId,variant:variant,stage:'requested',delegated:false,courierId:null,source:null}))}
  function rescued(w){var r=w.completed&&w.completed['adasme-01'];return !!(w.paid&&w.paid.indexOf('adasme-01')>=0&&w.effects&&w.effects.indexOf('adasme-01')>=0&&r&&r.provisional===false&&r.recipient==='Adasme · Vicuña Mackenna')}
  function join(w,r,courierId){
    request(r);need(r.stage==='requested','Esta solicitud ya fue recibida.');
    if(w.matiasBridge){cargo(w.matiasBridge);need(w.matiasBridge.requestId===r.requestId,'La carga pertenece a otra solicitud.');return copy(w)}
    var next=copy(w);next.matiasBridge=cargo({version:1,requestId:r.requestId,courierId:courierId,stage:'requested',source:null,recipient:null});
    need(next.progression&&Array.isArray(next.progression.known));
    if(next.progression.known.indexOf('adasme-01')<0)next.progression.known.push('adasme-01');
    return next;
  }
  function idle(w){return !(w.run&&(['active','failed'].indexOf(w.run.status)>=0||w.run.pending))}
  function collect(w){
    var b=cargo(w.matiasBridge);if(b.stage!=='requested')return copy(w);
    need(idle(w)&&w.location==='vicuna','Recoge la reserva en Vicuña al terminar o devolver el viaje actual.');
    var next=copy(w);next.matiasBridge.stage='collected';next.matiasBridge.source=rescued(w)?'rescue':'direct';return next;
  }
  function deliver(w){
    var b=cargo(w.matiasBridge);if(b.stage==='delivered')return copy(w);
    need(b.stage==='collected','Todavía no recogiste la reserva.');
    need(idle(w)&&w.location==='heroes','Lleva la reserva hasta Los Héroes y termina el viaje.');
    var next=copy(w);next.matiasBridge.stage='delivered';next.matiasBridge.recipient='Posta de Los Héroes';
    if(rescued(w))next.matiasBridge.source='rescue';return next;
  }
  function receive(r,w){
    request(r);if(r.stage!=='requested')return copy(r);
    need(w&&w.schema===1&&w.mode==='production'&&w.contentVersion==='2026-09-18.production.2');
    var b=cargo(w.matiasBridge);need(b.stage==='delivered'&&b.requestId===r.requestId,'No hay una recepción para esta solicitud.');
    if(b.source==='rescue')need(rescued(w),'No se puede confirmar el rescate de Darío.');
    var next=copy(r);next.stage='delivered';next.courierId=b.courierId;next.source=b.source;return request(next);
  }
  function review(r){var next=copy(request(r));need(next.stage!=='requested','La posta aún espera la reserva.');next.stage='reviewed';return next}
  function delegate(r){var next=copy(request(r));next.delegated=true;return next}
  function blocked(r){return !!(r&&request(r).variant==='A'&&r.stage!=='reviewed'&&!r.delegated)}
  root.NeoCommunityBridge=Object.freeze({request:request,cargo:cargo,create:create,join:join,collect:collect,deliver:deliver,receive:receive,review:review,delegate:delegate,blocked:blocked,idle:idle,rescued:rescued});
})(globalThis);
