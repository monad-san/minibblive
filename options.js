
function save_options() {
  var select = document.getElementById("team");
  var team = select.children[select.selectedIndex].value;
  localStorage["selected_team"] = team;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function restore_options() {
  var team = localStorage["selected_team"];
  if (!team) {
    return;
  }
  var select = document.getElementById("team");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == team) {
      child.selected = "true";
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.querySelector('button').addEventListener('click', save_options);
});
