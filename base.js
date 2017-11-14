// Plugin starts ****************************************************
(function ( $ ) {
	 $.qparams = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results==null){
		   return null;
		}
		else{
		   return decodeURI(results[1]) || 0;
		}
	}
	
    var ipfshash = "";
    const ipfs = new Ipfs()
    $.loadIPFS = function(hash) {
		$.getJSON("https://ipfs.io/ipfs/"+hash,function(data) {
				data["ipfs-hash"]=hash;
				$.each(data,function(i,v) {
						if(i!="ipfs-hash") {
							$("#"+i).val(v);
							$("#"+i).attr('readonly','readonly');
						}
				});				
		});
	};
    $.fn.persist = function() {
		console.log(this.length);
		var obj={};
		this.each(function() {
			obj[$(this).attr('id')]=$(this).val();
			
		});
		var parent=this;
		ipfs.files.add({path:'/',content:new ipfs.types.Buffer(JSON.stringify(obj),'ascii')}, function (err, files) {
				parent.each(function() {
					if($(this).attr('id')!="ipfs-hash") {
						$(this).attr("ipfs-hash",files[0].hash);
						$(this).attr("readonly","readonly");					
					} else {
						$(this).val(files[0].hash);
						$(this).on('change',function() {
								$.loadIPFS($(this).val());
						});
					}
				});				
		});			
		return this;
    };
 
}( jQuery ));


// ******************************************************************

$('#btn_save').click(function() {
		$('.form-control').persist();
});

$('#btn_load').click(function() {
		$.loadIPFS($('#ipfs-hash').val());
});
var extid="fury.network."+Math.random();

if($.qparams("extid")!=null) {
		extid=$.qparams("extid");
}
var node = new document.StromDAOBO.Node({external_id:extid,testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});

// Fill View (HTML) using JQuery
$('.account').html(node.wallet.address);
