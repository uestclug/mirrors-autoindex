$(document).ready(function () {
  var item_number = 0;
  var isRootDir = GetUrlRelativePath().split("/").length == 2;
  $("h1:contains(Index of /)").remove();

  $(".index-main")
    .children("pre")
    .replaceTag("<div>", true);

  $(".index-main")
    .children("hr")
    .remove();
  $(".index-main")
    .children("pre")
    .addClass("list-group");
  $(".index-main")
    .children("pre")
    .children("a")
    .addClass("list-group-item");
  var item_number = $(".index-main").children("pre").children("a").length;
  if (item_number <= 100){
    $(".index-main")
      .children("pre")
      .children("a")
      .each(function (index, item) {
        if (item.innerText === "../") return;
        var text_add = null;
        var show_arr = item.nextSibling.textContent
          .trim()
          .split("  ")
          .filter(function (entry) {
            return entry.trim() != "";
          });
        var tag_show = document.createElement("div");
        var before_icon = document.createElement("span");
        if (isRootDir) {
          text_add = show_arr[0];
          before_icon.className = "icon time";
        } else {
          text_add = show_arr[1];
          before_icon.className = "size";
        }
        tag_show.appendChild(before_icon);
        tag_show.className = "tagshow";
        tag_show.appendChild(document.createTextNode(text_add));
        item.appendChild(tag_show);
        item.nextSibling.remove();
      });
  }

  $(".index-main")
    .children("pre")
    .contents()
    .filter(function () {
      return this.nodeType == 3;
    })
    .remove();

  $(function () {
    $("#input").fastLiveFilter(".list-group");
  });

  if (isRootDir) {
    $("a:contains(../)").remove();
    $(".index-main")
      .children("pre")
      .children("a")
      .addClass("distro");
    $(".index-main")
      .children("pre")
      .children("a")
      .each(function (index, item) {
        item.setAttribute(
          "id",
          item.innerText.split("\n")[0].replace(/\//g, "")
        );
      });
    $("#item-counter").text(item_number - 1);
    RefreshStatus();
  } else {
    if (item_number === 0) {
      var not_found = $('<div class="container not-found">您来到了没有文件的荒岛</div>')
      not_found.prepend($('<span class="not-found-icon"></span>'))
      $(".index-main").append(not_found);
    }
    $("#item-counter-p").remove();
    $(".display-title").replaceWith("<h4>UESTC Mirrors</h4>");
    $(".quick-nav").remove();
  }

  $(window).scroll(function () {
    if ($(this).scrollTop() > 400) {
      $(".navbar").addClass("solid");
    } else {
      $(".navbar").removeClass("solid");
    }
  });
});

$.extend({
  replaceTag: function (
    element,
    tagName,
    withDataAndEvents,
    deepWithDataAndEvents
  ) {
    var newTag = $("<" + tagName + ">")[0];
    $.each(element.attributes, function () {
      newTag.setAttribute(this.name, this.value);
    });
    $(element)
      .children()
      .clone(withDataAndEvents, deepWithDataAndEvents)
      .appendTo(newTag);
    return newTag;
  }
});
$.fn.extend({
  replaceTag: function (tagName, withDataAndEvents, deepWithDataAndEvents) {
    return this.map(function () {
      return jQuery.replaceTag(
        this,
        tagName,
        withDataAndEvents,
        deepWithDataAndEvents
      );
    });
  }
});

function GetUrlRelativePath() {
  var url = document.location.toString();
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
  var relUrl = arrUrl[1].substring(start);

  if (relUrl.indexOf("?") != -1) {
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
}

function RefreshStatus() {
  $.ajax({
    url: "/status/",
    type: "GET",
    success: function (data) {
      $(data)
        .children("a")
        .each(function (index, item) {
          var show_arr = item.nextSibling.textContent
            .trim()
            .split("  ")
            .filter(function (entry) {
              return entry.trim() != "";
            });
          if (show_arr.length == 2) {
            switch (show_arr[1].replace(" ", "")) {
              case "8": //syncing
                $("#" + item.innerText).addClass("list-group-item-warning");
                var time_show = document.createElement("div");
                var time_icon = document.createElement("span");
                time_icon.className = "icon time time-syncing";
                time_show.className = "tagshow";
                time_show.appendChild(time_icon);
                time_show.appendChild(document.createTextNode("同步中"));
                $("#" + item.innerText + " .tagshow").replaceWith(time_show);
                break;
              case "6": //failed
                $("#" + item.innerText).addClass("list-group-item-danger");
                var time_show = document.createElement("div");
                var time_icon = document.createElement("span");
                time_icon.className = "icon time time-failed";
                time_show.className = "tagshow";
                time_show.appendChild(time_icon);
                time_show.appendChild(document.createTextNode("同步出错"));
                $("#" + item.innerText + " .tagshow").replaceWith(time_show);
                break;
              default:
                var time_show = document.createElement("div");
                var time_icon = document.createElement("span");
                time_icon.className = "icon time";
                time_show.className = "tagshow";
                time_show.appendChild(time_icon);
                time_show.appendChild(document.createTextNode(show_arr[0]));
                $("#" + item.innerText + " .tagshow").replaceWith(time_show);
                break;
            }
          }
        });
    }
  });
}

function formatBytes(a, b) {
  if (0 == a) return "0 Bytes";
  var c = 1024,
    d = b || 2,
    e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}
