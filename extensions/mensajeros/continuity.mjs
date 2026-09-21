// Read-only accounts: paid receipts are evidence, a remote profile is not a live call.
const confirmed=(w,id)=>w.paid.includes(id)&&w.completed?.[id]?.provisional===false?w.completed[id]:null;
export function pendingReport(w){
 if(confirmed(w,'jimenez-01')?.jimenezVersion===1&&!w.jimenezFollowup?.returned)return 'Queda llevar a Jiménez el informe de Los Leones. Puedes iniciar el regreso a Vicuña desde su contacto; el enlace completo sigue sin confirmarse.';
 if(confirmed(w,'guzman-01')?.guzmanVersion===1&&!w.guzmanFollowup?.returned)return 'Queda llevar a Guzmán la recepción de Plaza. Puedes iniciar el regreso a Los Leones desde su contacto.';
 return '';
}
export function completedContact(data,w,npc){
 const ids=Object.values(data.missions).filter(m=>m.npc===npc).map(m=>m.id);
 if(ids.some(id=>w.progression?.known.includes(id)&&!w.paid.includes(id)))return null;
 const receipts=ids.map(id=>[id,confirmed(w,id)]).filter(([,r])=>r);
 if(!receipts.length)return null;
 const paragraphs=[];
 for(const [id,r] of receipts){
  const flags=r.flags||[],has=x=>flags.includes(x);
  if(r.corridorVersion!==2){paragraphs.push('La entrega de «'+data.missions[id].name+'» está confirmada. El registro anterior no conserva todos los detalles de las decisiones; no se completan de memoria.');continue;}
  if(id==='relevo-01')paragraphs.push(has('relevo_confirmado')?'En La Moneda, Elena recibió la confirmación de que su hermano seguía en el depósito. El equipo dejó anotado que debía incluirse su puesto en el próximo aviso.':'El equipo entregó la consulta de Elena en Plaza. Esa entrega no confirma dónde estaba su hermano: el comprobante no incluye una respuesta para ella.');
  if(id==='morales-01')paragraphs.push(has('paso_carro')?'Morales conserva la prueba del carro vacío y el límite de peso sin verificar. La copia para Noa contiene esa misma advertencia; el reconocimiento no certifica el paso de cualquier carga.':'Morales conserva la indicación de transportar a mano. No hay una prueba del paso con ruedas; el equipo dejó ese límite en la copia para Noa.');
  if(id==='romero-01')paragraphs.push(has('vigia_asistido')?'Romero recibió la nota del vendaje que Bruno cambió a Julián. La revisión médica quedó pendiente: ayudarlo durante el trayecto no equivale a darle el alta.':'Romero recibió la ubicación de Julián y su petición de atención. El equipo no vio una visita posterior; el registro conserva esa necesidad sin afirmar que alguien ya fue.');
  if(id==='ana-01')paragraphs.push(has('herramientas_repartidas')?'El equipo vio recibir a las familias en Los Héroes y devolver las herramientas que repartieron. La responsable explicó el turno de comida. La confirmación para Ana quedó encargada al relevo; el equipo no ha comprobado que ella la reciba.':'El equipo vio recibir a las familias en Los Héroes con el bolso reparado. La responsable les indicó dónde dejar las cosas. La confirmación para Ana quedó encargada al relevo; el equipo no ha comprobado que ella la reciba.');
 }
 if(!paragraphs.length)return null;
 return {title:'Después de la entrega',paragraphs,receipts:receipts.map(([id])=>id)};
}
