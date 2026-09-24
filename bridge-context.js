/* Production uses the non-blocking policy; legacy review variants keep isolated keys. */
(function(root){
  var variant=null;
  try{variant=new URL('https://local.invalid/'+(root.location.search||'')).searchParams.get('bridgeLab')}catch(e){}
  try{var ancestor=root.parent;for(var depth=0;!variant&&ancestor&&ancestor!==root&&depth<8;depth++){if(ancestor.NeoBridgeContext)variant=ancestor.NeoBridgeContext.variant;if(ancestor.parent===ancestor)break;ancestor=ancestor.parent}}catch(e){}
  if(variant!=='A'&&variant!=='B')variant=null;
  root.NeoBridgeContext=Object.freeze({variant:variant,policy:variant||'B',key:function(key){return variant?'neosantiago.lab.bridge.'+variant+'.'+key:key}});
})(globalThis);
