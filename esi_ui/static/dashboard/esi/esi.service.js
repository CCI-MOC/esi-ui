(function() {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.esiService', esiService);
    
  esiService.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service',
    'horizon.app.core.openstack-service-api.keystone',
    'horizon.app.core.openstack-service-api.network',
  ];
  
  function esiService(apiService, toastService, keystoneAPI, networkAPI) {
    var stack = [];
    var onmessageDefer;
    var socket = {
      socket: new WebSocket('ws://127.0.0.1:10000'),
      send: function(data) {
        data = JSON.stringify(data);
        if (socket.socket.readyState === WebSocket.OPEN) {
          socket.socket.send(data);
        } else {
          stack.push(data);
        }
      },
      onmessage: function(callback) {
        if (socket.socket.readyState === WebSocket.OPEN) {
          socket.socket.onmessage = callback;
        } else {
          onmessageDefer = callback;
        }
      },
    };
    socket.socket.onopen = function() {
      for (const i in stack) {
        socket.socket.send(stack[i]);
      }
      stack = [];
      if (onmessageDefer) {
        socket.socket.onmessage = onmessageDefer;
        onmessageDefer = null;
      }
    };

    keystoneAPI.getCurrentUserSession().then(function(response) {
      socket.send(response.data.token);
      socket.send(response.data.project_id);
    });

    var service = {
      socket: function() { return socket; },
      nodeList: nodeList,
      setPowerState: setPowerState,
      createLease: createLease,
      deleteLease: deleteLease,
      provision: provision,
      unprovision: unprovision,
      networkAttach: networkAttach,
      networkDetach: networkDetach,
      floatingIPAttach: floatingIPAttach,
      floatingIPDetach: floatingIPDetach,
      offerList: offerList,
      offerClaim: offerClaim,
      createOffer: createOffer,
      deleteOffer: deleteOffer,
    };
    return service;

    function nodeList() {
      return apiService.get('/api/esi/nodes/').catch(err => {
        toastService.add('error', 'Unable to retrieve ESI nodes. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function setPowerState(node, target_state) {
      var data = {
        target: target_state
      };

      return apiService.put('/api/esi/nodes/' + node.uuid + '/states/power', data).catch(err => {
        toastService.add('error', 'Unable to set power state. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function createLease(lease_params) {
      return apiService.post('/api/esi/leases/', lease_params).catch(err => {
        toastService.add('error', 'Unable to create lease(s). ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function deleteLease(lease_uuid) {
      return apiService.delete('/api/esi/leases/' + lease_uuid).catch(err => {
        toastService.add('error', 'Unable to delete lease(s). ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function provision(node, provision_params) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/deploy/', provision_params).catch(err => {
        toastService.add('error', 'Unable to provision a node. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function unprovision(node) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/undeploy/').catch(err => {
        toastService.add('error', 'Unable to unprovision a node. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }    

    function networkAttach(node, network_params) {
      return apiService.post('/api/esi/nodes/' + node.uuid + '/vifs', network_params).catch(err => {
        toastService.add('error', 'Unable to attach network. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function networkDetach(node, network_params) {
      return apiService.delete('/api/esi/nodes/' + node.uuid + '/vifs/' + network_params.port).catch(err => {
        toastService.add('error', 'Unable to detach network. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function floatingIPAttach(floatingIPToAttach, portID) {
      if (floatingIPToAttach.id === 'Create new one') {
        return networkAPI.allocateFloatingIp(floatingIPToAttach.networkID).then(response => {
          return networkAPI.associateFloatingIp(response.data.id, portID).catch(err => {
            toastService.add('error', 'Unable to attach floating IP. ' + (err.data ? err.data : ''))
            return Promise.reject(err);
          })
        }).catch(err => {
          toastService.add('error', 'Unable to create new a floating IP. ' + (err.data ? err.data : ''))
          return Promise.reject(err);
        })
      } else {
        return networkAPI.associateFloatingIp(floatingIPToAttach.id, portID).catch(err => {
          toastService.add('error', 'Unable to attach floating IP. ' + (err.data ? err.data : ''))
          return Promise.reject(err);
        })
      }
    }

    function floatingIPDetach(floatingIPToDetach) {
      return networkAPI.disassociateFloatingIp(floatingIPToDetach).catch(err => {
        toastService.add('error', 'Unable to detach floating IP. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      })
    }

    function offerList() {
      return apiService.get('/api/esi/offers/').catch(err => {
        toastService.add('error', 'Unable to retrieve ESI offers. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function offerClaim(offer, times) {
      console.log(times);
      return apiService.put('/api/esi/offers/' + offer.uuid, times).catch(err => {
        toastService.add('error', 'Unable to claim an offer. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function createOffer(offer_params) {
      return apiService.post('/api/esi/offers/', offer_params).catch(err => {
        toastService.add('error', 'Unable to create offer(s). ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function deleteOffer(offer_uuid) {
      return apiService.delete('/api/esi/offers/' + offer_uuid).catch(err => {
        toastService.add('error', 'Unable to delete offer(s). ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }
  }

})();