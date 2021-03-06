var Issue       = require('model').getModelByName('Issue');
var lib = require('./lib/lib.js');

exports = module.exports = create;

function create(request, reply) {

  Issue.all({}, gotIssues);
 
  function gotIssues(err, issues) {
    var filtered = [];

    for (var i=0;i<issues.length;i++){
      if(issues[i].labels.length === 0 &&
        !issues[i].assignee && !issues[i].milestone) {
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
      a: 'active',
      nrMaxPages: paginationData.nrMaxPages,
      nrCurrentPage: paginationData.nrCurrentPage,
      previousPageNr: paginationData.previousPageNr,
      nextPageNr: paginationData.nextPageNr,
      typeIssues: 'untouched'
    };
    
    reply.view('template', context);
  }
}
