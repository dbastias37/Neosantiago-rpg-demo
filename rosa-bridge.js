/* A reception agreement is evidence of a route, never evidence that Rosa moved. */
(function(root){
  'use strict';
  var copy=function(x){return JSON.parse(JSON.stringify(x))};
  function need(ok,text){if(!ok)throw Error(text||'Registro de recepción de Rosa inválido.')}
  function id(x){return typeof x==='string'&&/^[a-zA-Z0-9_-]{8,96}$/.test(x)}
  function method(x){return ['lists','contact','legacy'].indexOf(x)>=0}
  function request(x){
    need(x&&x.version===1&&id(x.requestId)&&['requested','delivered','reviewed'].indexOf(x.stage)>=0);
    need(x.stage==='requested'?x.courierId===null&&x.method===null:id(x.courierId)&&method(x.method));return x;
  }
  function cargo(x){
    need(x&&x.version===1&&id(x.requestId)&&id(x.courierId)&&['requested','collected','delivered'].indexOf(x.stage)>=0);
    need(x.stage==='delivered'?x.recipient==='Recepción civil · Los Héroes'&&method(x.method):x.recipient===null&&x.method===null);return x;
  }
  function create(requestId){return request({version:1,requestId:requestId,stage:'requested',courierId:null,method:null})}
  function idle(w){return !(w.run&&(['active','failed'].indexOf(w.run.status)>=0||w.run.pending))}
  function receipt(w){
    var r=w.completed&&w.completed['ana-01'];
    need(w.paid&&w.paid.indexOf('ana-01')>=0&&w.effects&&w.effects.indexOf('ana-01')>=0&&r&&r.provisional===false&&r.recipient==='Responsables de acceso · Los Héroes','Falta confirmar la llegada de las familias del encargo de Ana.');return r;
  }
  function receivedMethod(w){var r=receipt(w),flags=r.flags||[];return flags.indexOf('acuerdo_verificado')>=0?'lists':flags.indexOf('acuerdo_confirmado')>=0?'contact':'legacy'}
  function join(w,r,courierId){
    request(r);need(r.stage==='requested','Esta recepción ya está confirmada.');
    if(w.rosaBridge){cargo(w.rosaBridge);need(w.rosaBridge.requestId===r.requestId,'La solicitud pertenece a otra expedición.');return copy(w)}
    var next=copy(w);next.rosaBridge=cargo({version:1,requestId:r.requestId,courierId:courierId,stage:'requested',recipient:null,method:null});
    need(next.progression&&Array.isArray(next.progression.known));
    if(next.progression.known.indexOf('ana-01')<0)next.progression.known.push('ana-01');return next;
  }
  function collect(w){
    var b=cargo(w.rosaBridge);if(b.stage!=='requested')return copy(w);
    need(idle(w)&&w.location==='plaza','Habla con Ana en Plaza de Armas antes de iniciar la escolta o al terminar el viaje actual.');
    var next=copy(w);next.rosaBridge.stage='collected';return next;
  }
  function deliver(w){
    var b=cargo(w.rosaBridge);if(b.stage==='delivered')return copy(w);
    need(b.stage==='collected','Ana aún no entregó el añadido para la red de Rosa.');
    need(idle(w)&&w.location==='heroes','Presenta el añadido en Los Héroes después de terminar o devolver el viaje actual.');
    var next=copy(w);next.rosaBridge.method=receivedMethod(w);next.rosaBridge.stage='delivered';next.rosaBridge.recipient='Recepción civil · Los Héroes';return next;
  }
  function receive(r,w){
    request(r);if(r.stage!=='requested')return copy(r);
    need(w&&w.schema===1&&w.mode==='production'&&w.contentVersion==='2026-09-18.production.2');
    var b=cargo(w.rosaBridge);need(b.requestId===r.requestId&&b.stage==='delivered'&&b.method===receivedMethod(w),'No hay una recepción confirmada para esta solicitud.');
    var next=copy(r);next.stage='delivered';next.courierId=b.courierId;next.method=b.method;return request(next);
  }
  function review(r){var next=copy(request(r));need(next.stage!=='requested','Aún no llega la confirmación.');next.stage='reviewed';return next}
  root.NeoRosaBridge=Object.freeze({request:request,cargo:cargo,create:create,join:join,collect:collect,deliver:deliver,receive:receive,review:review,idle:idle,receipt:receipt});
})(globalThis);
