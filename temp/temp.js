//Example 1: Method stub
function init() {
  fetchData('some search string', skip, top)
      .done(doneCallback)
      .fail(failCallback)
      .always(alwaysCallback);
}

function fetchData(searchString, skip, top) {
    ...
}

//Example 2: URL Stub
function init() {
   var url = '/data.json';

   $.ajax({
       method: 'GET',
       url: url
   })
   .done(doneCallback)
   .fail(failCallbacl)
   .always(alwaysCallback);
}


////////////////////





////////////////////


//Avoid
function init() {
    $.get('/news.json').done(callback);
}

//Recommended
function init() {
    if ($('.newsList').length <= 0) {
        return;
    }

    $.get('/news.json').done(callback);
}