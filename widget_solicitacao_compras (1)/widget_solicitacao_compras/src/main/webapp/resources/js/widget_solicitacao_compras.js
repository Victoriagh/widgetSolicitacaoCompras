var SolicitacaoCompra = SuperWidget.extend({
    

    //método iniciado quando a widget é carregada
    init: function() {
    	
    	if(this.isEditMode) {
			
			this.carregaDatasets();
			
		}else{
			
			this.listaTabela();
			
		}
    	
    },
  
    //BIND de eventos
    bindings: {
    	local : {
			'save-dataset-params' : [ 'click_saveParams' ]
		},
        global: {}
    },
 
    carregaDatasets: function(){
    	
    	var that = this;
    	var myArrayDataset;
    	
    	$.ajax({
    		type: 'GET',
    		async: false,
    		dataType: 'json',
    		url: '/api/public/ecm/dataset/availableDatasets',
    		contentType: 'application/json',
    		success: function(data, status, xhr){
    			
    			for(var i=0; i<data.content.length; i++){
    				
    				$('#select_dataset_'+that.instanceId).append('<option value="'+data.content[i]+'">'+data.content[i]+'</option>')
    				
    			}
    			
    		},
    		error: function(xhr, status, error){
    			FLUIGC.toast({
    				message : "Erro: " + error,
    				type: "danger"
    			})
    		}
    	});
    	
    	//VERIFICO SE HÁ PARÂMETRO
    	if(that.dataset != ""){
    		
    		$('#select_dataset_'+that.instanceId).val(that.dataset);
    		
    	}
    
    },
    
    saveParams : function(element, event) {
		var preferences = {};
		preferences.dataset = $('#select_dataset_' + this.instanceId).val();
		
		WCMSpaceAPI.PageService.UPDATEPREFERENCES({
			async : true,
			success : function(data) {
				FLUIGC.toast({
					message : data.message,
					type : 'success'
				});
			},
			fail : function(xhr, message, errorData) {
				FLUIGC.toast({
					message : errorData.message,
					type : 'danger'
				});
			}
		}, this.instanceId, preferences);
	},
	
	listaTabela: function(){
    	
    	var that = this;
    	var mydata;
    	
    	$.ajax({
    		type: 'GET',
    		async: false,
    		dataType: 'json',
    		url: '/api/public/ecm/dataset/search?datasetId='+that.dataset+'&likeField=metadata_active,true',
    		contentType: 'application/json',
    		success: function(data, status, xhr){
    			
    			mydata = data.content;
    			
    		},
    		error: function(xhr, status, error){
    			FLUIGC.toast({
    				message : "Erro: " + error,
    				type: "danger"
    			})
    		}
    	});
    	
    	
    	var myTable = FLUIGC.datatable('#table_' + that.instanceId, {
    	    dataRequest: mydata,
    	    renderContent: ['nomePontoComercial', 'dataOrcamento', 'rua', 'telefone'],
    	    header: [
    	        {'title': 'Nome'},
    	        {'title': 'Data Orçamento'},
    	        {'title': 'Rua'},
    	        {'title': 'Telefone'}
    	    ]
    	});
    	
    },

});

