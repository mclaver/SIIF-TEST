;(function (undefined) {
    'use strict';
	console.log("inicio");
    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';

    // Declare cypher package
    sigma.utils.pkg("sigma.neo4j");

    // Initialize package:
    sigma.utils.pkg('sigma.utils');
    sigma.utils.pkg('sigma.parsers');

    /**
     * This function is an helper for the neo4j communication.
     *
     * @param   {string|object}     neo4j       The URL of neo4j server or a neo4j server object.
     * @param   {string}            endpoint    Endpoint of the neo4j server
     * @param   {string}            method      The calling method for the endpoint : 'GET' or 'POST'
     * @param   {object|string}     data        Data that will be sent to the server
     * @param   {function}          callback    The callback function
     * @param   {integer}           timeout     The amount of time in milliseconds that neo4j should run the query before
     *                                          returning a timeout error.  Note, this will only work if the following
     *                                          two settings are added to the neo4j property files:
     *                                          To the file './conf/neo4j.properties' add 'execution_guard_enabled=true'.
     *                                          To the file './conf/neo4j-server.properties' add 'org.neo4j.server.webserver.limit.executiontime={timeout_in_seconds}'.
     *                                          Make sure the timeout in the above property file is greater then the timeout that
     *                                          you want to send with the request, because neo4j will use whichever timeout is shorter.
     */
    sigma.neo4j.send = function(neo4j, endpoint, method, data, callback, timeout) {
        var
          xhr = sigma.utils.xhr(),
          timeout = timeout || -1,
          url,
          user,
          password;

        // if neo4j arg is not an object
        url = neo4j;
        if(typeof neo4j === 'object') {
            url = neo4j.url;
            user = neo4j.user;
            password = neo4j.password;
        }

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';

        // Construct the endpoint url
        url += endpoint;

        xhr.open(method, url, true);
        if( user && password) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + password));
        }
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        if (timeout > 0) {
        	xhr.setRequestHeader('max-execution-time', timeout);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(data);
    };

    /**
     * This function parse a neo4j cypher query result, and transform it into
     * a sigma graph object.
     *
     * @param  {object}     result      The server response of a cypher query.
     *
     * @return A graph object
     */
    sigma.neo4j.cypher_parse = function(result) {
        var graph = { nodes: [], edges: [] },
            nodesMap = {},
            edgesMap = {},
            key;

        if (!Array.isArray(result))
          result = result.results[0].data;
	  var x= Math.random();
          var y= Math.random();
        // Iteration on all result data
        result.forEach(function (data) {

            // iteration on graph for all node
            data.graph.nodes.forEach(function (node) {
		var NODO_COLOR =""	
		var ETIQUETA =""
		var TAMANO =40
		
		switch(node.labels[0]) {
    		case "Denunciado":
        		NODO_COLOR="#0F0";	
                        ETIQUETA=node.properties.nombre + " " + node.properties.apellido;
						TAMANO=1500;
						
        	break;
    		case "Denunciante":
        		NODO_COLOR="#00F";
				TAMANO=1500
			ETIQUETA=node.properties.Nombre + " " + node.properties.Apellido
				
        	break;
			case "Denuncia":
                NODO_COLOR="#F00"; 
				TAMANO=2000;
				ETIQUETA=node.properties.doc_id
				
                break;
			case "Caso":
                NODO_COLOR="#FF00"; 
				TAMANO=3000;
				ETIQUETA= node.properties.doc_id
                
				break;
			case "Persona":
                NODO_COLOR="#0F0";	
                ETIQUETA=node.properties.nombre + " " + node.properties.apellido;
				TAMANO=1500;
				
                break;
			case "Domicilio":
                NODO_COLOR="#0FF";	
                ETIQUETA=node.properties.calle + " " + node.properties.altura;
				TAMANO=1500;
                break;	
    		case "Contacto":
                NODO_COLOR="#0FA0";	
                ETIQUETA=node.properties.pco_tipo + ": " + node.properties.pco_valor;
				TAMANO=1500;
                break;	
			default:
        		NODO_COLOR="#0FF";	
				ETIQUETA=node.properties.title
		}

		x=Math.random();
		y=Math.random();
		var sigmaNode =  {
                    id : node.id,
		    label : ETIQUETA,
                    x : x,//Math.random(),
                    y : y,//Math.random(),
                    size : TAMANO,
                    color : NODO_COLOR,
                    hover_color: '#0FFF',
                    neo4j_labels : node.labels,
                    neo4j_data : node.properties
                };


		/*if (node.labels=='Person'){
                var sigmaNode =  {
                    id : node.id,
                    label : "Actor: " + node.properties.name,
                    x : Math.random(),
                    y : Math.random(),
                    size : 5,
		    color : "#0F0",
                    neo4j_labels : node.labels,
                    neo4j_data : node.properties

                };

		}else if{

		var sigmaNode =  {
                    id : node.id,
                    label : node.properties.Nombre + " " + node.properties.Apellido + " > " + node.labels,
                    x : Math.random(),
                    y : Math.random(),
                    size : 5,
		    color : "#0FF",
                    neo4j_labels : node.labels,
                    neo4j_data : node.properties
		};
		console.log("test : " + node.properties)



		}*/
                if (sigmaNode.id in nodesMap) {
                    // do nothing
                } else {
                    nodesMap[sigmaNode.id] = sigmaNode;
                }
            });

            // iteration on graph for all node
            data.graph.relationships.forEach(function (edge) {
            
			var EDGE_COLOR="#0F0";
			var EDGE_TAMANO=200;
			
				switch(edge.type) {
					case "VICTIMA_EN":
						EDGE_COLOR="#FF0000";
                        EDGE_TAMANO=200;
						break;
					
					case "DAMNIFICADO_EN":
						EDGE_COLOR="#F78181";
                        EDGE_TAMANO=200;
						break;
						
					case "INTERVENTOR_EN":
						EDGE_COLOR="#74DF00";
                        EDGE_TAMANO=200;
						break;
								
					case "QUERELLANTE_EN":
						EDGE_COLOR="#0000FF";
                        EDGE_TAMANO=200;
						break;
						
					case "DENUNCIADO_EN":
						EDGE_COLOR="#B404AE";
                        EDGE_TAMANO=200;
						break;
						
					case "DENUNCIANTE_EN":
						EDGE_COLOR="#FFBF00";
                        EDGE_TAMANO=200;
						break;
						
					case "OCURRIO_EN":
						EDGE_COLOR="#FFBF00";
                        EDGE_TAMANO=200;
						break;
						
					case "VIVE_EN":
						EDGE_COLOR="#F0BF00";
                        EDGE_TAMANO=200;
						break;
				
				}
				
				
				
				
				var sigmaEdge =  {
                    id:  edge.id,
                    label: edge.type,
                    size: EDGE_TAMANO,//Math.random(),
					color: EDGE_COLOR,
                    type: ['line', 'curve', 'arrow', 'curvedArrow'][Math.random() * 4 | 0],
					//type: ['line', 'curve', 'arrow'][Math.random() * 4 | 0],
                    source: edge.startNode,
                    target: edge.endNode,
                    neo4j_type : edge.type,
                    neo4j_data : edge.properties
                    
                };

                if (sigmaEdge.id in edgesMap) {
                    // do nothing
                } else {
                    edgesMap[sigmaEdge.id] = sigmaEdge;
                }
            });

        });

        // construct sigma nodes
        for (key in nodesMap) {
            graph.nodes.push(nodesMap[key]);
        }
        // construct sigma nodes
        for (key in edgesMap) {
            graph.edges.push(edgesMap[key]);

        }

        return graph;
    };


    /**
     * This function execute a cypher and create a new sigma instance or
     * updates the graph of a given instance. It is possible to give a callback
     * that will be executed at the end of the process.
     *
     * @param  {object|string}      neo4j       The URL of neo4j server or a neo4j server object.
     * @param  {string}             cypher      The cypher query
     * @param  {?object|?sigma}     sig         A sigma configuration object or a sigma instance.
     * @param  {?function}          callback    Eventually a callback to execute after
     *                                          having parsed the file. It will be called
     *                                          with the related sigma instance as
     *                                          parameter.
     */
    sigma.neo4j.cypher = function (neo4j, cypher, sig, callback, timeout) {
        var
          endpoint = '/db/data/transaction/commit',
          timeout = timeout || -1,
          data,
          cypherCallback;

        // Data that will be sent to the server
        data = JSON.stringify({
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents": ["graph"],
                    "includeStats": false
                }
            ]
        });

        // Callback method after server response
        cypherCallback = function (callback) {

            return function (response) {
                if (response.errors.length > 0)
                    return callback(null, response.errors);

                var graph = { nodes: [], edges: [] };

                graph = sigma.neo4j.cypher_parse(response);

                // Update the instance's graph:
                if (sig instanceof sigma) {
                    sig.graph.clear();
                    sig.graph.read(graph);

                    // ...or instantiate sigma if needed:
                } else if (typeof sig === 'object') {
			sig = new sigma({
  			graph: graph,
  			renderer: {
    			container: document.getElementById('graph-container'),
    			type: 'canvas'
  			},
  			settings: {
    				//enableEdgeHovering: false,
				enableEdgeHovering: true,
    				nodeActiveBorderSize: 2,
    				nodeActiveOuterBorderSize: 3,
    				defaultNodeActiveBorderColor: '#fff',
    				defaultNodeActiveOuterBorderColor: 'rgb(236, 81, 72)',
    				nodeHaloColor: 'rgba(236, 81, 72, 0.2)',
    				nodeHaloSize: 70,
  			}
			});

		console.log("hola");
		// Instanciate the ActiveState plugin:
		//var activeState = sigma.plugins.activeState(s);
		var activeState = sigma.plugins.activeState(sig);
		//var keyboard = sigma.plugins.keyboard(s, s.renderers[0]);
		var keyboard = sigma.plugins.keyboard(sig, sig.renderers[0]);

		// Initialize the Select plugin:
		//var select = sigma.plugins.select(s, activeState);
		var select = sigma.plugins.select(sig, activeState);
		select.bindKeyboard(keyboard);

		// Initialize the dragNodes plugin:
		//var dragListener = sigma.plugins.dragNodes(s, s.renderers[0], activeState);
		var dragListener = sigma.plugins.dragNodes(sig, sig.renderers[0], activeState);

		dragListener.bind('startdrag', function(event) {console.log(event) });



		// Initialize the lasso plugin:
		var lasso = new sigma.plugins.lasso(sig, sig.renderers[0], {
  		'strokeStyle': 'rgb(236, 81, 72)',
  		'lineWidth': 2,
  		'fillWhileDrawing': true,
  		'fillStyle': 'rgba(236, 81, 72, 0.2)',
  		'cursor': 'crosshair'
		});

		select.bindLasso(lasso);
		lasso.activate();

		// halo on active nodes:
		function renderHalo() {
  			//s.renderers[0].halo({
			sig.renderers[0].halo({
    			nodes: activeState.nodes()
  		});
		}

		//s.renderers[0].bind('render', function(e) {
		sig.renderers[0].bind('render', function(e) {
  			renderHalo();
			});


		//"spacebar" + "s" keys pressed binding for the lasso tool
		keyboard.bind('32+83', function() {
  		if (lasso.isActive) {
    			lasso.deactivate();
  		} else {
    			lasso.activate();
  		}
		});

		
		// Listen for selectedNodes event
		lasso.bind('selectedNodes', function (event) {
  		setTimeout(function() {
    		lasso.deactivate();
    		//s.refresh({ skipIdexation: true });
		sig.refresh({ skipIdexation: true });
  		}, 0);
		});

                    //sig = new sigma(sig);
                    //sig.graph.read(graph);
                    sig.refresh();

                    // ...or it's finally the callback:
                } else if (typeof sig === 'function') {
                    callback = sig;
                    sig = null;
                }

                // Call the callback if specified:
                if (callback)
                    callback(sig || graph);
            };
        };

			
	console.log("llamado a neo4j");
        // Let's call neo4j
        sigma.neo4j.send(neo4j, endpoint, 'POST', data, cypherCallback(callback), timeout);
    };

    /**
     * This function call neo4j to get all labels of the graph.
     *
     * @param  {string}       neo4j      The URL of neo4j server or an object with the url, user & password.
     * @param  {function}     callback   The callback function
     *
     * @return An array of label
     */
    sigma.neo4j.getLabels = function(neo4j, callback) {
        sigma.neo4j.send(neo4j, '/db/data/labels', 'GET', null, callback);
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {string}       neo4j      The URL of neo4j server or an object with the url, user & password.
     * @param  {function}     callback   The callback function
     *
     * @return An array of relationship type
     */
    sigma.neo4j.getTypes = function(neo4j, callback) {
        sigma.neo4j.send(neo4j, '/db/data/relationship/types', 'GET', null, callback);
    };

}).call(this);

