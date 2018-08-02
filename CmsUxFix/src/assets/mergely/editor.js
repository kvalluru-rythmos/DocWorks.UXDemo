var comp;
var isSwap = false;
var lhsContent = {
  isLeft: true,
  content: ''
};
var rhsContent = {
  isLeft: false,
  content: ''
};
var iconconf = {
  'left-read-only': {
    get: function get() {
      return comp.mergely('cm', 'lhs').getOption('readOnly');
    },
    set: function set(value) {
      comp.mergely('cm', 'lhs').setOption('readOnly', value);
    }
  },
  'right-read-only': {
    get: function get() {
      return comp.mergely('cm', 'rhs').getOption('readOnly');
    },
    set: function set(value) {
      comp.mergely('cm', 'rhs').setOption('readOnly', value);
    }
  }
};

function handleOperation(operation) {
  switch (operation) {
    case 'undo-left':
      comp.mergely('cm', 'lhs').getDoc().undo();
      break;
    case 'redo-left':
      comp.mergely('cm', 'lhs').getDoc().redo();
      break;
    case 'undo-right':
      comp.mergely('cm', 'rhs').getDoc().undo();
      break;
    case 'redo-right':
      comp.mergely('cm', 'rhs').getDoc().redo();
      break;
    case 'left-read-only':
      iconconf[operation].set(!iconconf[operation].get());
      if ($('#' + operation).hasClass('active')) {
        $('#' + operation).removeClass('active');
      } else {
        $('#' + operation).addClass('active');
      }
      break;
    case 'right-read-only':
      iconconf[operation].set(!iconconf[operation].get());
      if ($('#' + operation).hasClass('active')) {
        $('#' + operation).removeClass('active');
      } else {
        $('#' + operation).addClass('active');
      }
      break;
    case 'edit-left-merge-right-file':
      comp.mergely('merge', 'rhs');
      break;
    case 'edit-right-merge-left-file':
      comp.mergely('merge', 'lhs');
      break;
    case 'lhs-search':
      if ($('#search-left').hasClass('hidden')) {
        $('#search-left').removeClass('hidden');
        $('#lhs-search-text').val('');
      } else {
        $('#search-left').addClass('hidden');
      }
      break;
    case 'rhs-search':
      if ($('#search-right').hasClass('hidden')) {
        $('#search-right').removeClass('hidden');
        $('#rhs-search-text').val('');
      } else {
        $('#search-right').addClass('hidden');
      }
      break;
    case 'prev':
      comp.mergely('scrollToDiff', 'prev');
      break;
    case 'next':
      comp.mergely('scrollToDiff', 'next');
      break;
    case 'wrap':
      changeOptions(function (x) {
        x.wrap_lines = !x.wrap_lines;
      });
      break;
    case 'change-left':
      comp.mergely('mergeCurrentChange', 'lhs');
      break;
    case 'change-right':
      comp.mergely('mergeCurrentChange', 'rhs');
      break;
    case 'swap':
      comp.mergely('swap');
      isSwap = !isSwap;
      sendDataToParent({
        isSwap: isSwap
      });
      break;
    case 'save-left-content':
      lhsContent.content = $('#mergely').mergely('get', 'lhs');
      lhsContent.isCreateDraft = true;
      sendDataToParent(lhsContent);
      break;
    case 'save-right-content':
      rhsContent.content = $('#mergely').mergely('get', 'rhs');
      rhsContent.isCreateDraft = true;
      sendDataToParent(rhsContent);
      break;
    case 'lhs-search-next':
      var searchText = $('#lhs-search-text').val();
      comp.mergely('search', 'lhs', searchText, 'next');
      break;
    case 'lhs-search-previous':
      var searchText = $('#lhs-search-text').val();
      comp.mergely('search', 'lhs', searchText, 'prev');
      break;
    case 'lhs-search-close':
      $('#search-left').addClass('hidden');
      break;
    case 'rhs-search-next':
      var searchText = $('#rhs-search-text').val();
      comp.mergely('search', 'rhs', searchText, 'next');
      break;
    case 'rhs-search-previous':
      var searchText = $('#rhs-search-text').val();
      comp.mergely('search', 'rhs', searchText, 'prev');
      break;
    case 'rhs-search-close':
      $('#search-right').addClass('hidden');
      break;
    default:
      break;
  }
}

function changeOptions(changer) {
  var options = comp.mergely('options');
  options.height = '200px';
  changer(options);
  comp.mergely('options', options);
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if (event.data.isDataCompare) {
    var leftContent = $('#mergely').mergely('get', 'lhs');
    var rightContent = $('#mergely').mergely('get', 'rhs');
    sendDataToParent({
      isDataCompare: event.data.isDataCompare,
      leftContent: leftContent,
      rightContent: rightContent
    })
  } else {
    $('#mergely').mergely(event.data.isLeft ? 'lhs' : 'rhs', event.data.content?event.data.content:'');
  }
  if (event.data.disableLeft) {
    $('#left-save-Draft').addClass('hidden');
    $('.icon-swap').addClass('hidden');
  }
  if (event.data.disableRight) {
    $('#right-save-Draft').addClass('hidden');
    $('.icon-swap').addClass('hidden');
  }
}

function sendDataToParent(data) {
  window.parent.postMessage(data, '*');
}

$(document).ready(function () {
  comp = $('#mergely');
  comp.mergely({
    height: $(document).height() - 40
  });
  var displayType = getParamValue('displayType');
  if (displayType && displayType === '1') {
    $('#left-save-Draft').addClass('hidden');
    $('.icon-swap').addClass('hidden');
  }
  handleOperation('wrap');
});

function openOptions(id) {
  document.getElementById(id).classList.toggle("show");
}

window.onclick = function (event) {
  if (!(event.target.matches('.mergely-button-primary') || event.target.matches('.fa-cog'))) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function getParamValue(paramName) {
  var url = window.location.search.substring(1); //get rid of "?" in querystring
  var qArray = url.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++) {
    var pArr = qArray[i].split('='); //split key and value
    if (pArr[0] == paramName)
      return pArr[1]; //return value
  }
}
