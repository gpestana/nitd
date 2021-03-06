var Issue       = require('model').getModelByName('Issue');
var lib = require('./lib/lib.js');

exports = module.exports = create;

function create(request, reply) {

  Issue.all({}, gotIssues);
 
  function gotIssues(err, issues) {
    var filtered = [];

    for (var i=0;i<issues.length;i++){
      if(!issues[i].milestone) {
        filtered.push(issues[i]);
      }
    }

    filtered.sort(function (issueA, issueB){
      return issueA.number - issueB.number;
    });

    //execute pagination
    var nrPage = request.params.nrpage.slice(1);
    paginationData = lib.issuesPagination(filtered, nrPage);

    var context = {
      issues: paginationData.paginadedFiltered,
      d: 'active',
      nrMaxPages: paginationData.nrMaxPages,
      nrCurrentPage: paginationData.nrCurrentPage,
      nrPages: paginationData.nrMaxPages,
      previousPageNr: paginationData.previousPageNr,
      nextPageNr: paginationData.nextPageNr,
      typeIssues: 'noMilestone'

    };
    reply.view('template', context);
    //console.log(filtered[0]);
  }




}
