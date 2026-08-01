import barba from "./barba.js";
import Button from "./component/button/button.js";
import Header from "./component/header/Header.js";
import Loader from "./component/loader/Loader.js";
import Shimmer from "./component/shimmer/shimmer.js";
import Sidemenu from "./component/sidemenu/Sidemenu.js";
import Table from "./component/table/Table.js";
import Toaster from "./component/toaster/toaster.js";
import "./component/multicheck/multicheck.js";
import ProgressBar from "./component/progress-bar/Progress-bar.js";
import Alert from "./component/alert/alert.js";
// sidemenu
const sidemenu = new Sidemenu();
sidemenu.render();
sidemenu.hint({
  target: "admission",
  content: `new`,
});
// header
const header = new Header();
header.render();
// shimmer
const shimmer = new Shimmer();
shimmer.render();
// Toster
const toaster = new Toaster();
// Loader
const loader = new Loader();
const editorInstances = new WeakMap();
const editorPending = new WeakSet();

function createClassicEditor(target) {
  if (!target) {
    return Promise.resolve();
  }
  if (editorInstances.has(target)) {
    return Promise.resolve(editorInstances.get(target));
  }
  // Prevent double-init while ClassicEditor.create() is still pending
  if (editorPending.has(target)) {
    return Promise.resolve();
  }
  editorPending.add(target);
  return ClassicEditor.create(target)
    .then((editor) => {
      editorPending.delete(target);
      editorInstances.set(target, editor);
      return editor;
    })
    .catch((error) => {
      editorPending.delete(target);
      console.error(error);
    });
}

function initEditors(scope = document) {
  $(scope)
    .find(".editor")
    .each(function () {
      createClassicEditor(this);
    });
}

function initializeItineraryEditors(scope = document) {
  const $context = scope
    ? scope instanceof HTMLElement
      ? $(scope)
      : $(scope)
    : $(document);

  $context
    .find(".firstItineary, .itineary textarea")
    .each(function () {
      const $textarea = $(this);
      if (!$textarea.hasClass("editor")) {
        $textarea.addClass("editor");
      }
      createClassicEditor(this);
    });
}

function destroyEditor(target) {
  if (!target) {
    return;
  }
  const editor = editorInstances.get(target);
  if (editor) {
    editor.destroy().catch((error) => {
      console.error(error);
    });
    editorInstances.delete(target);
  }
}

function deleteItineraryOnServer(itineraryId) {
  if (!itineraryId || itineraryId === "new" || itineraryId === "undefined") {
    return Promise.resolve(true);
  }
  return fetch("action/deleteItinary.php?id=" + encodeURIComponent(itineraryId), {
    method: "GET",
    credentials: "same-origin",
  })
    .then((response) => response.text())
    .then((text) => {
      const trimmed = String(text).trim();
      return trimmed === "1" || trimmed.indexOf('"status":1') !== -1;
    })
    .catch(() => false);
}

function removeItineraryBlock($block, recountFn) {
  const itineraryId = $block.attr("data-id");
  return deleteItineraryOnServer(itineraryId).then((ok) => {
    if (!ok && itineraryId && itineraryId !== "new") {
      toaster.trigger({
        content: "Could not delete itinerary day. Please try again.",
        timeout: 2500,
        type: "error",
      });
      return false;
    }
    $block.find("textarea.editor, textarea.firstItineary").each(function () {
      destroyEditor(this);
    });
    $block.remove();
    if (typeof recountFn === "function") {
      recountFn();
    }
    return true;
  });
}

function resolveAdminImgUrl(src, defaultFolder = "destinations") {
  if (!src) return "";
  if (typeof src === "object") {
    src = src.file_name || src.name || src.image || src.card_image || "";
  }
  if (typeof src !== "string" || !src) return "";
  if (src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("uploads/") || src.startsWith("assets/")) {
    return `../${src}`;
  }
  if (src.startsWith("../") || src.startsWith("/")) {
    return src;
  }
  if (src.startsWith("files/")) {
    return src;
  }
  return `files/${defaultFolder}/${src}`;
}

function imagePreviewHtml(src, alt = "Saved Image", defaultFolder = "destinations", isNew = false, customName = null) {
  if (!src) {
    return "";
  }
  if (typeof src === "object") {
    src = src.file_name || src.name || src.image || src.card_image || "";
  }
  if (!src) return "";
  const resolved = isNew || (typeof src === "string" && (src.startsWith("blob:") || src.startsWith("data:"))) ? src : resolveAdminImgUrl(src, defaultFolder);
  const rawFileName = typeof src === "string" ? src.split("/").pop().split("?")[0] : "Image";
  const fileName = customName || rawFileName;
  const shortFileName = fileName.length > 25 ? fileName.substring(0, 22) + "..." : fileName;
  
  const badgeText = isNew ? `✓ New Image Selected (${shortFileName})` : `✓ Saved Image Attached (${shortFileName})`;
  const badgeBg = isNew ? "#f0fdf4" : "#f0f9ff";
  const badgeColor = isNew ? "#15803d" : "#0369a1";
  const badgeBorder = isNew ? "#bbf7d0" : "#bae6fd";
  
  return `<div class="image-preview-item" style="margin-top:8px;display:inline-block">
    <img src="${resolved}" alt="${alt}" style="max-width:140px;max-height:140px;object-fit:cover;border-radius:8px;border:1px solid #cbd5e1;box-shadow:0 2px 6px rgba(0,0,0,0.08)" onerror="this.onerror=null; this.src='../assets/images/logo-color.png';" />
    <p style="font-size:12px;color:${badgeColor};background:${badgeBg};border:1px solid ${badgeBorder};padding:3px 8px;border-radius:4px;margin-top:6px;font-weight:600;display:inline-block">${badgeText}</p>
  </div>`;
}

function updateFileInputStatus($container, sources, isNew = false) {
  if (!$container || !$container.length) return;
  let $holder = $container.closest(".input-holder");
  if (!$holder.length) $holder = $container.parent();
  const $input = $holder.find('input[type="file"]');
  if (!$input.length) return;

  $input.css({ "display": "inline-block", "color": "transparent", "max-width": "130px", "vertical-align": "middle" });
  const $parentMulti = $input.parent();
  if ($parentMulti.hasClass("multi")) {
    $parentMulti.css({ "display": "inline-block", "vertical-align": "middle" });
  }

  const rawList = (Array.isArray(sources) ? sources : [sources]).filter(Boolean);
  const list = rawList.map(item => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.file_name || item.name || item.image || item.card_image || 'Image';
    }
    return 'Image';
  });

  let $status = $holder.find(".file-attached-status");
  if (!$status.length) {
    $status = $('<div class="file-attached-status" style="display:inline-block;margin-left:8px;vertical-align:middle;"></div>');
    if ($parentMulti.hasClass("multi")) {
      $parentMulti.after($status);
    } else {
      $input.after($status);
    }
  }

  if (!list.length) {
    $status.empty().hide();
    return;
  }

  if (isNew) {
    const fileNames = list.map(f => typeof f === 'string' ? f.split('/').pop().split('?')[0] : (f.name || 'File')).join(', ');
    const shortNames = fileNames.length > 25 ? fileNames.substring(0, 22) + '...' : fileNames;
    $status.html(`
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#15803d;background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 10px;border-radius:6px;">
        <i class="fas fa-file-upload"></i> Selected: <strong>${shortNames}</strong>
      </span>
    `).show();
  } else {
    const fileNames = list.map(src => typeof src === 'string' ? src.split('/').pop().split('?')[0] : 'Image').join(', ');
    const shortNames = fileNames.length > 25 ? fileNames.substring(0, 22) + '...' : fileNames;
    $status.html(`
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#0369a1;background:#f0f9ff;border:1px solid #bae6fd;padding:4px 10px;border-radius:6px;">
        <i class="fas fa-check-circle"></i> Attached: <strong>${shortNames}</strong>
      </span>
    `).show();
  }
}

function setImagePreview($container, sources, defaultFolder = "destinations", isNew = false, customNames = null) {
  if (!$container || !$container.length) {
    return;
  }
  const list = (Array.isArray(sources) ? sources : [sources]).filter(Boolean);
  if (!list.length) {
    $container.empty().hide();
    updateFileInputStatus($container, [], isNew);
    return;
  }
  $container
    .html(list.map((src, idx) => {
      const name = customNames ? (Array.isArray(customNames) ? customNames[idx] : customNames) : null;
      return imagePreviewHtml(src, "Preview", defaultFolder, isNew, name);
    }).join(""))
    .show();

  updateFileInputStatus($container, customNames || list, isNew);
}

function bindFilePreview($input, $container, { multiple = false } = {}) {
  if (!$input || !$input.length || !$container || !$container.length) {
    return;
  }
  $input.off("change.imagePreview").on("change.imagePreview", function () {
    const files = Array.from(this.files || []);
    if (!files.length) {
      return;
    }
    const urls = files.map((file) => URL.createObjectURL(file));
    const fileNames = files.map((file) => file.name);
    setImagePreview($container, multiple ? urls : urls[0], "destinations", true, multiple ? fileNames : fileNames[0]);
  });
}

function decodeHtml(value) {
  if (typeof value !== "string") {
    return value;
  }
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
barba.init({
  debug: false,
  prefetchIgnore: true,
  timeout: 10000,
  views: [
    {
      namespace: "dashboard",
      beforeEnter(data) {
        sidemenu.active("dashboard");
        header.update("Dashboard", sidemenu.iconHtml());
        loader.load();
        loader.stop();
        logCheck();
        logout();
        // fetch dashboard counts
        fetch("action/dashboard.php")
          .then((response) => response.json())
          .then((data) => {
            const {
              coustomize_count,
              package_enq_count,
              activity_ticket_count,
              destination_count,
              ticket_count,
              activity_count,
              blog_count,
              total_package,
            } = data;
            $("#customization").text(coustomize_count);
            $("#package_enq").text(package_enq_count);
            $("#activity_tickets").text(activity_ticket_count);
            $("#destinations").text(destination_count);
            $("#tickets").text(ticket_count);
            $("#activity").text(activity_count);
            $("#blog").text(blog_count);
            $("#packages").text(total_package);
          });
      },
    },
    {
      namespace: "destination",
      beforeEnter() {
        loader.load();
        sidemenu.active("destination");
        header.update(
          "List Destinations",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#destination-table")[0]);

        fetch("action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function for search
            const renderTable = (items) => {
              table.clear(); // Clears tbody and removes empty-state if present

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const {
                    destination_id,
                    destination_name,
                    icon,
                    thumbnail,
                    createdDate,
                    createdTime,
                  } = row;

                  const imageFile = thumbnail || icon;
                  const iconImg = imageFile
                    ? `<img src="files/destinations/${imageFile}" alt="${destination_name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #eee;" />`
                    : '<span style="color:#888">No icon</span>';

                  const rowContent = [
                    slno,
                    iconImg,
                    destination_name,
                    createdDate,
                    createdTime,
                  ];

                  table.addRow(rowContent, destination_id);

                  table.actions({
                    edit: "edit-destination.html?id=" + destination_id,
                    delete: async (id) => {
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteDestination.php", { id: id }) // Fixed: passing ID object
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted this destination",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.destination_name.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-destination",
      beforeEnter() {
        loader.load();
        sidemenu.active("destination");
        header.update(
          "Create destination",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const button = new Button($("#save_btn")[0]);
        $("#destination-form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const destinationName = $("#destination-name").val() || $("#destination_name").val() || "";
          const discription = $("#discription").val() || "";
          const meta = $("#meta").val() || "";
          const cardImgFile = $("#destination_card_image")[0] && $("#destination_card_image")[0].files ? $("#destination_card_image")[0].files[0] : null;
          const iconImgFile = $("#destination_icon")[0] && $("#destination_icon")[0].files ? $("#destination_icon")[0].files[0] : null;
          const innerImgFile = $("#destination_inner_image")[0] && $("#destination_inner_image")[0].files ? $("#destination_inner_image")[0].files[0] : null;
          let featured = 0;
          if ($("#featured").is(":checked")) {
            featured = 1;
          }
          let fd = new FormData();
          fd.append("destinationName", destinationName);
          if (cardImgFile) fd.append("destinationCardImage", cardImgFile);
          if (innerImgFile) fd.append("destinationInnerImage", innerImgFile);
          if (iconImgFile) fd.append("destinationIcon", iconImgFile);
          fd.append("discription", discription);
          fd.append("meta", meta);
          fd.append("featured", featured);
          fetch("./action/addDestination.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              button.stop();
              if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-destinations.html");
              } else {
                toaster.trigger({
                  content: `${data && data[0] ? data[0]["msg"] : "Failed to create destination"}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              button.stop();
              console.error(err);
              toaster.trigger({
                content: "An error occurred while creating destination",
                timeout: 2000,
                type: "error",
              });
            });
        });
      },
    },
    {
      namespace: "edit-destination",
      beforeEnter() {
        loader.load();
        sidemenu.active("destination");
        header.update(
          "Edit destination",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const id = location.href.split("=")[1];
        const button = new Button($("#save_btn")[0]);
        fetch("./action/fetchEditDestination.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              $("#destination_name").val(data[0]["destination_name"]);
              $("#discription").val(decodeHtml(data[0]["discription"]));
              $("#meta").val(data[0]["meta"]);
              if (data[0]["featured"] == 1) {
                $("#featured").prop("checked", true);
              }
              if (data[0]["card_image"]) {
                setImagePreview(
                  $("#destination_card_preview"),
                  data[0]["card_image"],
                  "destinations"
                );
              }
              if (data[0]["Inner_image"] || data[0]["inner_image"]) {
                setImagePreview(
                  $("#destination_inner_preview"),
                  data[0]["Inner_image"] || data[0]["inner_image"],
                  "destinations"
                );
              }
              if (data[0]["icon"]) {
                setImagePreview(
                  $("#destination_icon_preview"),
                  data[0]["icon"],
                  "destinations"
                );
              }
              bindFilePreview(
                $("#destination_card_image"),
                $("#destination_card_preview")
              );
              bindFilePreview(
                $("#destination_inner_image"),
                $("#destination_inner_preview")
              );
              bindFilePreview(
                $("#destination_icon"),
                $("#destination_icon_preview")
              );
            }
          });
        $("#destination-form").submit((x) => {
          x.preventDefault();
          button.load("Updating");
          const destinationName = $("#destination_name").val();
          const discription = $("#discription").val();
          const meta = $("#meta").val();
          const destinationCardImage = $("#destination_card_image")[0].files[0];
          const destinationIcon = $("#destination_icon")[0].files[0];
          const destinationInnerImage = $("#destination_inner_image")[0]
            .files[0];
          let featured = 0;
          if ($("#featured").is(":checked")) {
            featured = 1;
          }
          let fd = new FormData();
          fd.append("destinationName", destinationName);
          fd.append("destinationCardImage", destinationCardImage);
          fd.append("destinationInnerImage", destinationInnerImage);
          fd.append("destinationIcon", destinationIcon);
          fd.append("discription", discription);
          fd.append("meta", meta);
          fd.append("featured", featured);
          fd.append("id", id);
          fetch("action/editDestination.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              button.stop();
              if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-destinations.html");
              } else {
                toaster.trigger({
                  content: `${data && data[0] ? data[0]["msg"] : "Failed to update destination"}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              button.stop();
              console.error(err);
              toaster.trigger({
                content: "An error occurred while updating destination",
                timeout: 2000,
                type: "error",
              });
            });
        });
      },
    },
    {
      namespace: "list-place",
      beforeEnter() {
        loader.load();
        sidemenu.active("place");
        header.update("List Places", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#place-table")[0]);

        fetch("action/places.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { place_id, place_name, createdDate, createdTime } = row;
                  const rowContent = [slno, place_name, createdDate, createdTime];

                  table.addRow(rowContent, place_id);

                  table.actions({
                    edit: "edit-place.html?id=" + place_id,
                    delete: async (id) => {
                      // Fixed: Passing correct data structure
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deletePlace.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the place",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.place_name.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-place",
      beforeEnter() {
        loader.load();
        sidemenu.active("place");
        header.update("Add Place", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        /* ------------------------- fetch all main packages ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          });
        const button = new Button($("#save_btn")[0]);
        $("#place_form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const destination = $("#destinations").val();
          const place_name = $("#place_name").val();
          const meta = $("#meta").val();
          const image = $("#place_image")[0].files[0];
          let fd = new FormData();
          fd.append("destination", destination);
          fd.append("place_name", place_name);
          fd.append("meta", meta);
          fd.append("image", image);
          fetch("action/addPlace.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == 1) {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-place.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "edit-place",
      beforeEnter() {
        loader.load();
        sidemenu.active("place");
        header.update("Edit Place", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        const id = location.href.split("=")[1];
        fetch("./action/fetchPlaceEdit.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { place_name, destination_id, meta, image } = data[0];
              $("#place_name").val(place_name);
              $("#meta").val(decodeHtml(meta));
              if (image) {
                setImagePreview(
                  $("#place_image_preview"),
                  image,
                  "place"
                );
              }
              bindFilePreview($("#place_image"), $("#place_image_preview"));
              return destination_id;
            }
          })
          .then((destinationId) => {
            /* ------------------------- fetch all main packages ------------------------ */
            fetch("./action/destinations.php")
              .then((response) => response.json())
              .then((data) => {
                $("#destinations")
                  .empty()
                  .append(`<option value="">Select Destination</option>`);
                if (data.length) {
                  data.map((x) => {
                    const { destination_id, destination_name } = x;
                    $("#destinations").append(
                      `<option ${destinationId == destination_id ? "selected" : ""
                      } value="${destination_id}">${destination_name}</option>`
                    );
                  });
                }
              });
          });
        const button = new Button($("#save_btn")[0]);
        $("#place_form").submit((x) => {
          x.preventDefault();
          button.load("Updating");
          const destination = $("#destinations").val();
          const place_name = $("#place_name").val();
          const meta = $("#meta").val();
          const image = $("#place_image")[0].files[0];
          let fd = new FormData();
          fd.append("destination", destination);
          fd.append("place_name", place_name);
          fd.append("image", image);
          fd.append("meta", meta);
          fd.append("id", id);
          fetch("action/editPlace.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              button.stop();
              if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-place.html");
              } else {
                toaster.trigger({
                  content: `${data && data[0] ? data[0]["msg"] : "Failed to update place"}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              button.stop();
              console.error(err);
              toaster.trigger({
                content: "An error occurred while updating place",
                timeout: 2000,
                type: "error",
              });
            });
        });
      },
    },
    {
      namespace: "list-package",
      beforeEnter() {
        loader.load();
        sidemenu.active("package");
        header.update(
          "List Package",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#package-table")[0]);

        fetch("action/packages.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { package_id, package_title, createdDate, createdTime } = row;
                  const rowContent = [
                    slno,
                    package_title,
                    createdDate,
                    createdTime,
                  ];

                  table.addRow(rowContent, package_id);

                  table.actions({
                    edit: "edit-package.html?id=" + package_id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deletePackage.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the Package",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.package_title.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-package",
      beforeEnter() {
        loader.load();
        sidemenu.active("package");
        header.update("Add Package", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();

        let progressBar = new ProgressBar();
        progressBar.init();
        /* ------------------------- fetch all destinnations ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          });


        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");
            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                     <input type="text" placeholder="" id="place_name" placeholder="" />
                                     <div class="remove">X</div>
                                    </div>`;
            } else {
              template += ` <div class="multi ${elemType == "Itineary" ? `itineary` : `faq`
                }" data-id="new" id="${id}" style="flex-wrap : wrap;">
                                    <span> ${elemType == "Itineary"
                  ? `Enter Day ${count}`
                  : `Question ${count}`
                } </span>
                                     <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  class="${elemType == "Itineary" ? "title" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                 <div class="remove">X</div>
                ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/>'
                  : ""
                }
                                    
                                      <textarea class="${elemType == "Itineary" ? `editor` : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                    </div>`;
            }
            addButton.before(template);


            initEditors($("#" + id));
            $("#" + id)
              .find(".remove")
              .click(function () {
                const parent = $(this).parent();
                parent.find("textarea.editor").each(function () {
                  destroyEditor(this);
                });
                parent.remove();
              });
          });
        });
        function initRichEditor() {
          initEditors();
        }
        initRichEditor();
        initializeItineraryEditors($("#itineary"));

        // Handle category change to show/hide fixed departure date
        $("#package_category").on("change", function () {
          const selectedCategory = $(this).val();
          if (selectedCategory === "fixed_departures") {
            $("#fixed_date_holder").show();
            $("#fixed_departure_date").prop("required", true);
          } else {
            $("#fixed_date_holder").hide();
            $("#fixed_departure_date").prop("required", false);
            $("#fixed_departure_date").val(""); // Clear the date
          }
        });

        const button = new Button($("#save_btn")[0]);
        /* ------------------------------- add package ------------------------------ */
        $("main")
          .off()
          .on("submit", "#package_form", function (x) {
            x.preventDefault();
            button.load("Creating");

            const destination = $("#destinations").val();
            const title = $("#title").val();
            const duration = $("#duration").val();
            const hotel_type = $("#hotel_type").val();
            const cancellation = $("#cancellation").val();
            const transportation = $("#transportation").val();
            const activities = $("#activities").val();
            const amount = $("#amount").val();
            const meta = $("#meta").val();
            const description = $("#description").val();
            const images = $("#images")[0].files;
            const image_card = $("#image_card")[0].files[0];
            let highlights = [];
            let includes = [];
            let excludes = [];
            let thinks_to_know = [];
            let itinerary = [];
            let faq = [];
            /* -------------------------------- formdata -------------------------------- */
            let fd = new FormData();
            $("#pack_highlight input").each(function () {
              highlights.push($(this).val());
            });
            $("#thinks_to_know input").each(function () {
              thinks_to_know.push($(this).val());
            });
            $("#pack_includes input").each(function () {
              includes.push($(this).val());
            });
            $("#pack_excludes input").each(function () {
              excludes.push($(this).val());
            });

            $(".itineary").each(function (e) {
              fd.append("itineary_title[]", $(this).find("input").val());
              fd.append(
                "itineary_description[]",
                $(this).find("textarea").val()
              );
              const imageFile = $(this).find(".iteneary_image")[0].files.length
                ? $(this).find(".iteneary_image")[0].files[0]
                : null;
              if (imageFile) {
                fd.append("itineary_images[]", imageFile);
              } else {
                fd.append(
                  "itineary_images[]",
                  new Blob([""], { type: "text/plain" }),
                  ""
                );
              }
            });

            $(".faq").each(function () {
              faq.push({
                question: $(this).find(".question_title").val(),
                answer: $(this).find("textarea").val(),
              });
            });

            fd.append("title", title);
            fd.append("description", description);
            fd.append("destination", destination);
            fd.append("duration", duration);
            fd.append("hotel_type", hotel_type);
            fd.append("cancellation", cancellation);
            fd.append("transportation", transportation);
            fd.append("amount", amount);
            fd.append("meta", meta);
            fd.append("image_card", image_card);
            fd.append("activities", activities);
            fd.append("category", $("#package_category").val());
            fd.append("fixed_departure_date", $("#fixed_departure_date").val());
            fd.append("highlights", JSON.stringify(highlights));
            fd.append("includes", JSON.stringify(includes));
            fd.append("excludes", JSON.stringify(excludes));
            fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
            fd.append("faq", JSON.stringify(faq));
            for (let i = 0; i < images.length; i++) {
              fd.append("images[]", images[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-package.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to add package"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/createPackage.php", true);
            xhr.send(fd);

            // fetch('./action/createPackage.php', {
            //     method: 'post',
            //     body: fd
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-package.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "edit-package",
      beforeEnter() {
        loader.load();
        sidemenu.active("package");
        header.update(
          "Edit Package",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();

        let progressBar = new ProgressBar();
        progressBar.init();
        const id = location.href.split("=")[1];
        let editorId = null;

        //update count
        function iternearyCount() {
          $("#itineary .multi").each(function (i) {
            const count = $(this).find(".count span");
            count.text(i + 1);
          });
        }

        // Delegated remove for itinerary days (including day 1)
        $("#itineary")
          .off("click.itineraryRemove")
          .on("click.itineraryRemove", ".remove", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = $(this).closest(".itineary");
            if (!parent.length) {
              return;
            }
            removeItineraryBlock(parent, iternearyCount);
          });

        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");
            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                     <input type="text" placeholder="" id="place_name" placeholder="" />
                                      <div class="remove">X</div>
                                    </div>`;
            } else {

              template += ` <div class="multi ${elemType == "Itineary" ? `itineary` : `faq`
                }" data-id="new" id="${id}" style="flex-wrap : wrap;">
                                    <span class="${elemType == "Itineary" ? `count` : ``}"> ${elemType == "Itineary"
                  ? `Enter Day <span>${count}</span>`
                  : `Question ${count}`
                } </span>
                                     <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  class="${elemType == "Itineary" ? "title" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                 <div class="remove">X</div>
                ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/><div class="itineary-image-preview image-preview-wrap"></div>'
                  : ""
                }
                                    
                                      <textarea class="${elemType == "Itineary" ? `editor` : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                    </div>`;
            }
            addButton.before(template);
            initEditors($("#" + id));
            if (elemType == "Itineary") {
              initializeItineraryEditors($("#" + id));
              iternearyCount();
              const $newDay = $("#" + id);
              bindFilePreview(
                $newDay.find(".iteneary_image"),
                $newDay.find(".itineary-image-preview")
              );
            } else {
              $("#" + id)
                .find(".remove")
                .click(function () {
                  const parent = $(this).parent();
                  parent.find("textarea.editor").each(function () {
                    destroyEditor(this);
                  });
                  parent.remove();
                });
            }
          });
        });
        function initRichEditor() {
          initEditors();
        }
        /* ------------------------- fetch all destinnations ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          })
          .then(() => {
            fetch("./action/fetchPackageEdit.php?id=" + id)
              .then((response) => response.json())
              .then((data) => {
                if (data.length) {
                  const {
                    destination,
                    title,
                    duration,
                    hotel_type,
                    description,
                    no_of_activites,
                    cancellation,
                    transportation,
                    amount,
                    includes,
                    excludes,
                    highlights,
                    itinearies,
                    thinks_to_know,
                    meta,
                    faq,
                    category,
                    fixed_departure_date,
                    card_image,
                    images: packageImages,
                  } = data[0];
                  $("#title").val(title);
                  $("#destinations").val(destination);
                  $("#duration").val(duration);
                  $("#hotel_type").val(hotel_type);
                  $("#description").val(decodeHtml(description));
                  $("#activities").val(no_of_activites);
                  $("#cancellation").val(cancellation);
                  $("#transportation").val(transportation);
                  $("#amount").val(amount);
                  $("#meta").val(decodeHtml(meta));

                  // Existing package image previews
                  if (card_image) {
                    setImagePreview(
                      $("#card_image_preview"),
                      card_image,
                      "packages"
                    );
                  }
                  bindFilePreview(
                    $("#image_card"),
                    $("#card_image_preview")
                  );
                  if (packageImages && packageImages.length) {
                    setImagePreview(
                      $("#package_images_preview"),
                      (Array.isArray(packageImages)
                        ? packageImages
                        : Object.values(packageImages)
                      ).map((img) => typeof img === 'object' ? (img.image_name || img.file_name || img.image) : img),
                      "packages"
                    );
                  } else if (card_image) {
                    setImagePreview(
                      $("#package_images_preview"),
                      card_image,
                      "packages"
                    );
                  }
                  bindFilePreview(
                    $("#images"),
                    $("#package_images_preview"),
                    { multiple: true }
                  );

                  // Set category and handle fixed departure date visibility
                  $("#package_category").val(category || "curated_itineraries");
                  if (category === "fixed_departures" && fixed_departure_date) {
                    $("#fixed_date_holder").show();
                    $("#fixed_departure_date").val(fixed_departure_date);
                    $("#fixed_departure_date").prop("required", true);
                  }

                  // Handle category change to show/hide fixed departure date
                  $("#package_category").on("change", function () {
                    const selectedCategory = $(this).val();
                    if (selectedCategory === "fixed_departures") {
                      $("#fixed_date_holder").show();
                      $("#fixed_departure_date").prop("required", true);
                    } else {
                      $("#fixed_date_holder").hide();
                      $("#fixed_departure_date").prop("required", false);
                      $("#fixed_departure_date").val("");
                    }
                  });


                  // display highlights
                  highlights &&
                    highlights.map((x, i) => {
                      const { highlight } = x;
                      if (i == 0) {
                        $("#pack_highlight .multi input").val(highlight);
                      } else {
                        $("#pack_highlight .add-item").click();
                        $("#pack_highlight .multi")
                          .eq(-1)
                          .find("input")
                          .val(highlight);
                      }
                    });

                  // display thinks to know
                  thinks_to_know &&
                    thinks_to_know.map((x, i) => {
                      const { data } = x;
                      if (i == 0) {
                        $("#thinks_to_know .multi input").val(data);
                      } else {
                        $("#thinks_to_know .add-item").click();
                        $("#thinks_to_know .multi")
                          .eq(-1)
                          .find("input")
                          .val(data);
                      }
                    });

                  // display includes
                  includes &&
                    includes.map((x, i) => {
                      const { include } = x;
                      if (i == 0) {
                        $("#pack_includes .multi input").val(include);
                      } else {
                        $("#pack_includes .add-item").click();
                        $("#pack_includes .multi")
                          .eq(-1)
                          .find("input")
                          .val(include);
                      }
                    });

                  // display excludes
                  excludes &&
                    excludes.map((x, i) => {
                      const { exclude } = x;
                      if (i == 0) {
                        $("#pack_excludes .multi input").val(exclude);
                      } else {
                        $("#pack_excludes .add-item").click();
                        $("#pack_excludes .multi")
                          .eq(-1)
                          .find("input")
                          .val(exclude);
                      }
                    });




                  // display itinearies
                  itinearies &&
                    itinearies.map((x, i) => {

                      const { id, description, title, image } = x;
                      const imagePreview = image
                        ? imagePreviewHtml(`files/itineary/${image}`, title || "Day image")
                        : "";
                      if (i == 0) {
                        const $first = $("#itineary .itineary").first();
                        $first.find(".title").val(title);
                        $first.find("textarea").val(decodeHtml(description));
                        $first.attr("data-id", id);
                        setImagePreview(
                          $first.find(".itineary-image-preview"),
                          image ? `files/itineary/${image}` : ""
                        );
                        bindFilePreview(
                          $first.find(".iteneary_image"),
                          $first.find(".itineary-image-preview")
                        );
                      } else {
                        let editorId = Math.random().toString(16).slice(2);
                        const decodedItineraryDescription = decodeHtml(description);
                        const safeTitle = String(title || "")
                          .replace(/&/g, "&amp;")
                          .replace(/"/g, "&quot;")
                          .replace(/</g, "&lt;");
                        $("#itineary .add-item")
                          .before(`<div class="multi itineary" data-id="${id}" id="${editorId}" style="flex-wrap : wrap;">
                                <span class="count">Enter Day <span></span> Itineary</span>
                                <input type="text" placeholder="Title" value="${safeTitle}"  class="title" placeholder="" style="width : calc(100% - 50px)" />
                                 <div class="remove">X</div>
                                <input type="file" class="iteneary_image"/>
                                <div class="itineary-image-preview image-preview-wrap">${imagePreview}</div>
                                  <textarea class="editor"   style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" >${decodedItineraryDescription}</textarea>
                                </div>`);
                        iternearyCount();
                        initEditors($("#" + editorId));
                        const $day = $("#" + editorId);
                        if (imagePreview) {
                          $day.find(".itineary-image-preview").show();
                        }
                        bindFilePreview(
                          $day.find(".iteneary_image"),
                          $day.find(".itineary-image-preview")
                        );
                      }
                    });

                  // Bind preview for empty first day when package has no itineraries yet
                  if (!itinearies || !itinearies.length) {
                    const $first = $("#itineary .itineary").first();
                    bindFilePreview(
                      $first.find(".iteneary_image"),
                      $first.find(".itineary-image-preview")
                    );
                  }

                  // display faq
                  faq &&
                    faq.map((x, i) => {
                      const { question, answer } = x;
                      if (i == 0) {
                        $("#faq .multi input").val(question);
                        $("#faq .multi textarea").val(decodeHtml(answer));
                        // initRichEditor();
                      } else {
                        let editorId = Math.random().toString(16).slice(2);
                        const decodedFaqAnswer = decodeHtml(answer);
                        $("#faq .add-item")
                          .before(`<div class="multi faq" id="${editorId}" style="flex-wrap : wrap;">
                                <span>Question ${i + 1}</span>
                                 <input type="text" placeholder="Question" value="${question}"  id="question_title" placeholder="" style="width : calc(100% - 50px)" />
                                 <div class="remove">X</div>
                                  <textarea class=""   style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" >${decodedFaqAnswer}</textarea>
                                </div>`);
                        // initEditors($("#" + editorId));
                        $("#" + editorId)
                          .find(".remove")
                          .click(function () {
                            const parent = $(this).parent();
                            parent.find("textarea.editor").each(function () {
                              destroyEditor(this);
                            });
                            parent.remove();
                          });
                      }
                    });

                  initRichEditor();
                  initializeItineraryEditors($("#itineary"));
                }
              });

            const button = new Button($("#save_btn")[0]);
            /* ------------------------------- update package ------------------------------ */
            $("main")
              .off()
              .on("submit", "#package_form", function (x) {
                x.preventDefault();
                button.load("Updating");
                const destination = $("#destinations").val();
                const title = $("#title").val();
                const duration = $("#duration").val();
                const hotel_type = $("#hotel_type").val();
                const cancellation = $("#cancellation").val();
                const transportation = $("#transportation").val();
                const activities = $("#activities").val();
                const amount = $("#amount").val();
                const meta = $("#meta").val();
                const description = $("#description").val();
                const images = $("#images")[0].files;
                const card_image = $("#image_card")[0].files[0];
                let highlights = [];
                let includes = [];
                let excludes = [];
                let thinks_to_know = [];
                let itineary = [];
                let faq = [];
                /* -------------------------------- formdata -------------------------------- */
                let fd = new FormData();
                $("#pack_highlight input").each(function () {
                  highlights.push($(this).val());
                });
                $("#thinks_to_know input").each(function () {
                  thinks_to_know.push($(this).val());
                });
                $("#pack_includes input").each(function () {
                  includes.push($(this).val());
                });
                $("#pack_excludes input").each(function () {
                  excludes.push($(this).val());
                });

                $(".itineary").each(function (e) {
                  fd.append("id_array[]", $(this).attr("data-id"));
                  fd.append("itineary_title[]", $(this).find(".title").val());
                  fd.append(
                    "itineary_description[]",
                    $(this).find("textarea").val()
                  );
                  const imageFile = $(this).find(".iteneary_image")[0].files
                    .length
                    ? $(this).find(".iteneary_image")[0].files[0]
                    : null;
                  if (imageFile) {
                    fd.append("itineary_images[]", imageFile);
                  } else {
                    fd.append(
                      "itineary_images[]",
                      new Blob([""], { type: "text/plain" }),
                      ""
                    );
                  }
                });

                $(".faq").each(function () {
                  faq.push({
                    question: $(this).find("input").val(),
                    answer: $(this).find("textarea").val(),
                  });
                });
                fd.append("title", title);
                fd.append("description", description);
                fd.append("destination", destination);
                fd.append("duration", duration);
                fd.append("hotel_type", hotel_type);
                fd.append("cancellation", cancellation);
                fd.append("transportation", transportation);
                fd.append("amount", amount);
                fd.append("meta", meta);
                fd.append("activities", activities);
                fd.append("card_image", card_image);
                fd.append("id", id);
                fd.append("category", $("#package_category").val());
                fd.append("fixed_departure_date", $("#fixed_departure_date").val());
                fd.append("highlights", JSON.stringify(highlights));
                fd.append("includes", JSON.stringify(includes));
                fd.append("excludes", JSON.stringify(excludes));
                fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
                fd.append("faq", JSON.stringify(faq));
                for (let i = 0; i < images.length; i++) {
                  fd.append("images[]", images[i]);
                }

                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (event) {
                  var percent = (event.loaded / event.total) * 100;
                  progressBar.progress(percent);
                });
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      try {
                        let data = JSON.parse(xhr.responseText);
                        if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                          button.stop();
                          toaster.trigger({
                            content: `${data[0]["msg"]}`,
                            timeout: 2000,
                            type: "success",
                          });
                          setTimeout(() => {
                            barba.go("list-package.html");
                          }, 1000);
                        } else {
                          button.stop();
                          toaster.trigger({
                            content: `${data && data[0] ? data[0]["msg"] : "Failed to update package"}`,
                            timeout: 2000,
                            type: "error",
                          });
                        }
                      } catch (e) {
                        button.stop();
                        console.error(e);
                      }
                    } else {
                      button.stop();
                    }
                  }
                };
                xhr.open("POST", "./action/editPackage.php", true);
                xhr.send(fd);
              });
          });
      },
    },
    {
      namespace: "list-tickets",
      beforeEnter() {
        loader.load();
        sidemenu.active("ticket");
        header.update(
          "List Tickets",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#ticket-table")[0]);

        fetch("action/tickets.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { ticket_id, title, createdDate, createdTime } = row;
                  const rowContent = [slno, title, createdDate, createdTime];

                  table.addRow(rowContent, ticket_id);

                  table.actions({
                    edit: "edit-ticket.html?id=" + ticket_id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteTicket.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the Ticket",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.title.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-ticket",
      beforeEnter() {
        loader.load();
        sidemenu.active("ticket");
        header.update("Add Ticket", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        let progressBar = new ProgressBar();
        progressBar.init();
        /* ------------------------- fetch all destinnations ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          });
        let editorId;
        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");
            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                     <input type="text" placeholder="" id="place_name" placeholder="" />
                                     <div class="remove">X</div>
                                    </div>`;
            } else {
              template += ` <div class="multi ${elemType == "Itineary" ? `itineary` : `faq`
                }" data-id="new" id="${id}" style="flex-wrap : wrap;">
                                    <span> ${elemType == "Itineary"
                  ? `Enter Day ${count}`
                  : `Question ${count}`
                } </span>
                                     <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  class="${elemType == "Itineary" ? "title" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                 <div class="remove">X</div>
                ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/>'
                  : ""
                }
                                    
                                      <textarea class="${elemType == "Itineary" ? `editor` : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                    </div>`;
            }
            addButton.before(template);
            initEditors($("#" + id));
            if (elemType == "Itineary") {
              initializeItineraryEditors($("#" + id));
            }
            $("#" + id)
              .find(".remove")
              .click(function () {
                const parent = $(this).parent();
                parent.find("textarea.editor").each(function () {
                  destroyEditor(this);
                });
                parent.remove();
              });
          });
        });
        function initRichEditor() {
          initEditors();
        }
        initRichEditor();
        const button = new Button($("#save_btn")[0]);
        /* ------------------------------- add ticket ------------------------------ */
        $("main")
          .off()
          .on("submit", "#ticket_form", function (x) {
            x.preventDefault();
            button.load("Creating");
            const destination = $("#destinations").val();
            const title = $("#title").val();
            const short_title = $("#short_title").val();
            const duration = $("#duration").val();
            const hotel_type = $("#hotel_type").val();
            const cancellation = $("#cancellation").val();
            const transportation = $("#transportation").val();
            const activities = $("#activities").val();
            const discount_amount = $("#discount_amount").val();
            const meta = $("#meta").val();
            const display_amount = $("#display_amount").val();
            const description = $("#description").val();
            const adult_msg = $("#adult_msg").val();
            const validity = $("#Validity").val();
            const required_age = $("#required_age").val();
            const children_msg = $("#children_msg").val();
            const children_amount = $("#children_amount").val();
            const images = $("#images")[0].files;
            const card_image = $("#image_card")[0].files[0];
            let highlights = [];
            let includes = [];
            let excludes = [];
            let thinks_to_know = [];
            let faq = [];
            let featured = 0;
            if ($("#featured").is(":checked")) {
              featured = 1;
            }
            /* -------------------------------- formdata -------------------------------- */
            let fd = new FormData();
            $("#pack_highlight input").each(function () {
              highlights.push($(this).val());
            });
            $("#thinks_to_know input").each(function () {
              thinks_to_know.push($(this).val());
            });
            $("#pack_includes input").each(function () {
              includes.push($(this).val());
            });
            $("#pack_excludes input").each(function () {
              excludes.push($(this).val());
            });
            $(".faq").each(function () {
              faq.push({
                question: $(this).find("input").val(),
                answer: $(this).find("textarea").val(),
              });
            });
            fd.append("title", title);
            fd.append("short_title", short_title);
            fd.append("description", description);
            fd.append("adult_msg", adult_msg);
            fd.append("children_msg", children_msg);
            fd.append("destination", destination);
            fd.append("duration", duration);
            fd.append("hotel_type", hotel_type);
            fd.append("cancellation", cancellation);
            fd.append("transportation", transportation);
            fd.append("discount_amount", discount_amount);
            fd.append("meta", meta);
            fd.append("display_amount", display_amount);
            fd.append("children_amount", children_amount);
            fd.append("activities", activities);
            fd.append("featured", featured);
            fd.append("required_age", required_age);
            fd.append("Validity", validity);
            fd.append("card_image", card_image);
            fd.append("highlights", JSON.stringify(highlights));
            fd.append("includes", JSON.stringify(includes));
            fd.append("excludes", JSON.stringify(excludes));
            fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
            fd.append("faq", JSON.stringify(faq));
            for (let i = 0; i < images.length; i++) {
              fd.append("images[]", images[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-tickets.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to add ticket"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/createTicket.php", true);
            xhr.send(fd);

            // fetch('./action/createTicket.php', {
            //     method: 'post',
            //     body: fd
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-tickets.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "edit-ticket",
      beforeEnter() {
        loader.load();
        sidemenu.active("ticket");
        header.update("Edit Ticket", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        let progressBar = new ProgressBar();
        progressBar.init();
        const id = location.href.split("=")[1];
        let editorId = null;
        /* ------------------------- fetch all destinnations ------------------------ */
        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");
            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                         <input type="text" placeholder="" id="place_name" placeholder="" />
                                         <div class="remove">X</div>
                                        </div>`;
            } else {
              template += ` <div class="multi ${elemType == "Itineary" ? `itinerary` : `faq`
                }" id="${id}" style="flex-wrap : wrap;">
                                        <span> ${elemType == "Itineary"
                  ? `Enter Day ${count}`
                  : `Question ${count}`
                } </span>
                                         <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  id="${elemType == "Itineary" ? "place_name" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                 <div class="remove">X</div>
                                          ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/>'
                  : ""
                }
                                        
                                          <textarea class="${elemType == "Itineary"
                  ? `editor`
                  : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                        </div>`;
            }
            addButton.before(template);
            initEditors($("#" + id));
            $("#" + id)
              .find(".remove")
              .click(function () {
                const parent = $(this).parent();
                parent.find("textarea.editor").each(function () {
                  destroyEditor(this);
                });
                parent.remove();
              });
          });
        });
        function initRichEditor() {
          initEditors();
        }
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          })
          .then(() => {
            fetch("./action/fetchTicketEdit.php?id=" + id)
              .then((response) => response.json())
              .then((data) => {
                if (data.length) {
                  const {
                    destination_id,
                    title,
                    short_title,
                    duration,
                    hotel_type,
                    description,
                    adult_msg,
                    children_msg,
                    no_of_activities,
                    cancellation,
                    transportation,
                    discount_amount,
                    includes,
                    excludes,
                    highlights,
                    ticket_thinks_to_know,
                    featured,
                    display_amount,
                    validity,
                    required_age,
                    child_amount,
                    meta,
                    faq,
                    card_image,
                    ticket_images,
                  } = data[0];
                  $("#title").val(title);
                  $("#short_title").val(short_title);
                  $("#duration").val(duration);
                  $("#adult_msg").val(adult_msg);
                  $("#children_msg").val(children_msg);
                  $("#hotel_type").val(hotel_type);
                  $("#description").val(decodeHtml(description));
                  $("#activities").val(no_of_activities);
                  $("#cancellation").val(cancellation);
                  $("#transportation").val(transportation);
                  $("#discount_amount").val(discount_amount);
                  $("#display_amount").val(display_amount);
                  $("#adult_msg").val(adult_msg);
                  $("#children_msg").val(children_msg);
                  $("#destinations").val(destination_id);
                  $("#children_amount").val(child_amount);
                  $("#validity").val(validity);
                  $("#required_age").val(required_age);
                  $("#meta").val(decodeHtml(meta));
                  if (featured == 1) {
                    $("#featured").prop("checked", true);
                  }
                  if (card_image) {
                    setImagePreview(
                      $("#card_image_preview"),
                      card_image,
                      "tickets"
                    );
                  }
                  bindFilePreview($("#image_card"), $("#card_image_preview"));
                  if (ticket_images && ticket_images.length) {
                    setImagePreview(
                      $("#ticket_images_preview"),
                      ticket_images
                        .map((img) => typeof img === 'object' ? (img.image_names || img.file_name || img.image) : img)
                        .filter(Boolean),
                      "tickets"
                    );
                  }
                  bindFilePreview($("#images"), $("#ticket_images_preview"), {
                    multiple: true,
                  });
                  // initRichEditor();
                  // display highlights
                  highlights.map((x, i) => {
                    const { highlights } = x;
                    if (i == 0) {
                      $("#pack_highlight .multi input").val(highlights);
                    } else {
                      $("#pack_highlight .add-item").click();
                      $("#pack_highlight .multi")
                        .eq(-1)
                        .find("input")
                        .val(highlights);
                    }
                  });
                  // display thinks to know
                  ticket_thinks_to_know.map((x, i) => {
                    const { data } = x;
                    if (i == 0) {
                      $("#thinks_to_know .multi input").val(data);
                    } else {
                      $("#thinks_to_know .add-item").click();
                      $("#thinks_to_know .multi")
                        .eq(-1)
                        .find("input")
                        .val(data);
                    }
                  });
                  // display includes
                  includes.map((x, i) => {
                    const { includes } = x;
                    if (i == 0) {
                      $("#pack_includes .multi input").val(includes);
                    } else {
                      $("#pack_includes .add-item").click();
                      $("#pack_includes .multi")
                        .eq(-1)
                        .find("input")
                        .val(includes);
                    }
                  });
                  // display excludes
                  excludes.map((x, i) => {
                    const { excludes } = x;
                    if (i == 0) {
                      $("#pack_excludes .multi input").val(excludes);
                    } else {
                      $("#pack_excludes .add-item").click();
                      $("#pack_excludes .multi")
                        .eq(-1)
                        .find("input")
                        .val(excludes);
                    }
                  });
                  // display faq
                  faq.map((x, i) => {
                    const { question, answer } = x;
                    const decodedAnswer = decodeHtml(answer);
                    if (i == 0) {
                      $("#faq .multi input").val(question);
                      $("#faq .multi textarea").val(decodedAnswer);
                      // initRichEditor();
                    } else {
                      let editorId = Math.random().toString(16).slice(2);
                      $("#faq .add-item")
                        .before(`<div class="multi faq" id="${editorId}" style="flex-wrap : wrap;">
                                <span>Question ${i + 1}</span>
                                 <input type="text" placeholder="Question" value="${question}"  id="question_title" placeholder="" style="width : calc(100% - 50px)" />
                                 <div class="remove">X</div>
                                  <textarea class=""   style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" >${decodedAnswer}</textarea>
                                </div>`);
                      // ClassicEditor.create($('#' + editorId).find('textarea')[0])
                      //     .catch(error => {
                      //         console.error(error);
                      //     });
                      $("#" + editorId)
                        .find(".remove")
                        .click(function () {
                          const parent = $(this).parent();
                          parent.remove();
                        });
                    }
                  });
                }
                initRichEditor();
              });
          });
        const button = new Button($("#save_btn")[0]);
        /* ------------------------------- Edit Ticket ------------------------------ */
        $("main")
          .off()
          .on("submit", "#ticket_form", function (x) {
            x.preventDefault();
            button.load("Updating");
            const destination = $("#destinations").val();
            const title = $("#title").val();
            const short_title = $("#short_title").val();
            const duration = $("#duration").val();
            const hotel_type = $("#hotel_type").val();
            const cancellation = $("#cancellation").val();
            const transportation = $("#transportation").val();
            const activities = $("#activities").val();
            const discount_amount = $("#discount_amount").val();
            const display_amount = $("#display_amount").val();
            const description = $("#description").val();
            const required_age = $("#required_age").val();
            const validity = $("#validity").val();
            const children_amount = $("#children_amount").val();
            const adult_msg = $("#adult_msg").val();
            const children_msg = $("#children_msg").val();
            const meta = $("#meta").val();
            const images = $("#images")[0].files;
            const card_image = $("#image_card")[0].files[0];
            let highlights = [];
            let includes = [];
            let excludes = [];
            let thinks_to_know = [];
            let faq = [];
            let featured = 0;
            if ($("#featured").is(":checked")) {
              featured = 1;
            }
            /* -------------------------------- formdata -------------------------------- */
            let fd = new FormData();
            $("#pack_highlight input").each(function () {
              highlights.push($(this).val());
            });
            $("#thinks_to_know input").each(function () {
              thinks_to_know.push($(this).val());
            });
            $("#pack_includes input").each(function () {
              includes.push($(this).val());
            });
            $("#pack_excludes input").each(function () {
              excludes.push($(this).val());
            });
            $(".faq").each(function () {
              faq.push({
                question: $(this).find("input").val(),
                answer: $(this).find("textarea").val(),
              });
            });
            fd.append("title", title);
            fd.append("short_title", short_title);
            fd.append("description", description);
            fd.append("adult_msg", adult_msg);
            fd.append("children_msg", children_msg);
            fd.append("destination", destination);
            fd.append("duration", duration);
            fd.append("hotel_type", hotel_type);
            fd.append("cancellation", cancellation);
            fd.append("transportation", transportation);
            fd.append("discount_amount", discount_amount);
            fd.append("display_amount", display_amount);
            fd.append("activities", activities);
            fd.append("required_age", required_age);
            fd.append("validity", validity);
            fd.append("children_amount", children_amount);
            fd.append("featured", featured);
            fd.append("card_image", card_image);
            fd.append("meta", meta);
            fd.append("id", id);
            fd.append("highlights", JSON.stringify(highlights));
            fd.append("includes", JSON.stringify(includes));
            fd.append("excludes", JSON.stringify(excludes));
            fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
            fd.append("faq", JSON.stringify(faq));
            for (let i = 0; i < images.length; i++) {
              fd.append("images[]", images[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-tickets.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to update ticket"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/editTicket.php", true);
            xhr.send(fd);
          });
      },
    },
    {
      namespace: "list-activity",
      beforeEnter() {
        loader.load();
        sidemenu.active("activity");
        header.update(
          "List Activities",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#activity-table")[0]);

        fetch("action/activities.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { activity_id, title, createdDate, createdTime } = row;
                  const rowContent = [slno, title, createdDate, createdTime];

                  table.addRow(rowContent, activity_id);

                  table.actions({
                    edit: "edit-activity.html?id=" + activity_id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteActivity.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the Activity",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.title.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-activity",
      beforeEnter() {
        loader.load();
        sidemenu.active("activity");
        header.update(
          "Add Activity",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();

        let progressBar = new ProgressBar();
        progressBar.init();

        let editorId;
        /* ------------------------- fetch all destinnations ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          });
        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");
            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                         <input type="text" placeholder="" id="place_name" placeholder="" />
                                         <div class="remove">X</div>
                                        </div>`;
            } else {
              template += ` <div class="multi ${elemType == "Itineary" ? `itineary` : `faq`
                }" data-id="new" id="${id}" style="flex-wrap : wrap;">
                                    <span> ${elemType == "Itineary"
                  ? `Enter Day ${count}`
                  : `Question ${count}`
                } </span>
                                     <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  class="${elemType == "Itineary" ? "title" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                 <div class="remove">X</div>
                ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/>'
                  : ""
                }
                                    
                                      <textarea class="${elemType == "Itineary" ? `editor` : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                    </div>`;
            }
            addButton.before(template);
            initEditors($("#" + id));
            $("#" + id)
              .find(".remove")
              .click(function () {
                const parent = $(this).parent();
                parent.find("textarea.editor").each(function () {
                  destroyEditor(this);
                });
                parent.remove();
              });
          });
        });
        function initRichEditor() {
          initEditors();
        }
        initRichEditor();
        const button = new Button($("#save_btn")[0]);
        /* ------------------------------- add package ------------------------------ */
        $("main")
          .off()
          .on("submit", "#activity_form", function (x) {
            x.preventDefault();
            button.load("Creating");
            const destination = $("#destinations").val();
            const title = $("#title").val();
            const short_title = $("#short_title").val();
            const duration = $("#duration").val();
            const hotel_type = $("#hotel_type").val();
            const cancellation = $("#cancellation").val();
            const transportation = $("#transportation").val();
            const discount_amount = $("#discount_amount").val();
            const meta = $("#meta").val();
            const validity = $("#validity").val();
            const display_amount = $("#display_amount").val();
            const children_amount = $("#children_amount").val();
            const description = $("#description").val();
            const adult_msg = $("#adult_msg").val();
            const children_msg = $("#children_msg").val();
            const images = $("#images")[0].files;
            const card_image = $("#image_card")[0].files[0];
            let highlights = [];
            let includes = [];
            let excludes = [];
            let thinks_to_know = [];
            let faq = [];
            let featured = 0;
            if ($("#featured").is(":checked")) {
              featured = 1;
            }
            /* -------------------------------- formdata -------------------------------- */
            let fd = new FormData();
            $("#pack_highlight input").each(function () {
              highlights.push($(this).val());
            });
            $("#thinks_to_know input").each(function () {
              thinks_to_know.push($(this).val());
            });
            $("#pack_includes input").each(function () {
              includes.push($(this).val());
            });
            $("#pack_excludes input").each(function () {
              excludes.push($(this).val());
            });
            $(".faq").each(function () {
              faq.push({
                question: $(this).find("input").val(),
                answer: $(this).find("textarea").val(),
              });
            });
            fd.append("title", title);
            fd.append("short_title", short_title);
            fd.append("description", description);
            fd.append("adult_msg", adult_msg);
            fd.append("children_msg", children_msg);
            fd.append("destination", destination);
            fd.append("duration", duration);
            fd.append("hotel_type", hotel_type);
            fd.append("cancellation", cancellation);
            fd.append("transportation", transportation);
            fd.append("discount_amount", discount_amount);
            fd.append("meta", meta);
            fd.append("validity", validity);
            fd.append("display_amount", display_amount);
            fd.append("children_amount", children_amount);
            fd.append("featured", featured);
            fd.append("card_image", card_image);
            fd.append("highlights", JSON.stringify(highlights));
            fd.append("includes", JSON.stringify(includes));
            fd.append("excludes", JSON.stringify(excludes));
            fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
            fd.append("faq", JSON.stringify(faq));
            for (let i = 0; i < images.length; i++) {
              fd.append("images[]", images[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
              // $('.progress-bar').width(percent + '%').html(percent.toFixed(2) + '%');
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-tickets.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to add ticket"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/createActivity.php", true);
            xhr.send(fd);

            // fetch('./action/createActivity.php', {
            //     method: 'post',
            //     body: fd,
            //     onprogress: function (event) {
            //         var percent = (event.loaded / event.total) * 100;
            //         console.log(percent)
            //     }
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         return;
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-activities.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "edit-activity",
      beforeEnter() {

        loader.load();
        sidemenu.active("activity");
        header.update(
          "Edit Activity",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        let progressBar = new ProgressBar();
        progressBar.init();

        const id = location.href.split("=")[1];
        let editorId = null;
        $(".multi-inputs").each(function () {
          const addButton = $(this).find(".add-item");
          const type = $(this).attr("data-type");
          addButton.click((e) => {
            let id = Math.random().toString(16).slice(2);
            let count = $(this).find(".multi").length + 1;
            let template = "";
            const elemType = $(e.target).attr("data-type");

            if (type == "single") {
              // template
              template += ` <div class="multi" id="${id}">
                                             <input type="text" placeholder="" id="place_name" placeholder="" />
                                             <div class="remove">X</div>
                                            </div>`;
            } else {
              template += ` <div class="multi ${elemType == "Itineary" ? `itinerary` : `faq`
                }" id="${id}" style="flex-wrap : wrap;">
                                            <span> ${elemType == "Itineary"
                  ? `Enter Day ${count}`
                  : `Question ${count}`
                } </span>
                                             <input type="text" placeholder="${elemType == "Itineary"
                  ? `Title`
                  : `Question`
                }"  id="${elemType == "Itineary" ? "place_name" : "question_title"
                }" placeholder="" style="width : calc(100% - 50px)" />
                <div class="remove">X</div>
                                            ${elemType == "Itineary"
                  ? '<input type="file" class="iteneary_image"/>'
                  : ""
                }
                                             
                                              <textarea class="${elemType == "Itineary"
                  ? `editor`
                  : ``
                }"  style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" ></textarea>
                                            </div>`;
            }
            addButton.before(template);
            initEditors($("#" + id));
            $("#" + id)
              .find(".remove")
              .click(function () {
                const parent = $(this).parent();
                parent.find("textarea.editor").each(function () {
                  destroyEditor(this);
                });
                parent.remove();
              });
          });
        });
        function initRichEditor() {
          initEditors();
        }
        /* ------------------------- fetch all destinnations ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          })
          .then(() => {
            fetch("./action/fetchActivityEdit.php?id=" + id)
              .then((response) => response.json())
              .then((data) => {
                if (data.length) {
                  const {
                    destination_id,
                    title,
                    short_title,
                    duration,
                    hotel_type,
                    description,
                    adult_msg,
                    children_msg,
                    child_amount,
                    no_of_activities,
                    cancellation,
                    transportation,
                    discount_amount,
                    includes,
                    excludes,
                    highlights,
                    activity_thinks_to_know,
                    featured,
                    display_amount,
                    meta,
                    faq,
                    validity,
                    card_image,
                    activity_images,
                  } = data[0];
                  $("#title").val(title);
                  $("#short_title").val(short_title);
                  $("#destinations").val(destination_id);
                  $("#duration").val(duration);
                  $("#hotel_type").val(hotel_type);
                  $("#description").val(decodeHtml(description));
                  $("#adult_msg").val(adult_msg);
                  $("#validity").val(validity);
                  $("#children_msg").val(children_msg);
                  $("#children_amount").val(child_amount);
                  $("#activities").val(no_of_activities);
                  $("#cancellation").val(cancellation);
                  $("#transportation").val(transportation);
                  $("#discount_amount").val(discount_amount);
                  $("#display_amount").val(display_amount);
                  $("#meta").val(decodeHtml(meta));
                  if (featured == 1) {
                    $("#featured").prop("checked", true);
                  }
                  if (card_image) {
                    setImagePreview(
                      $("#card_image_preview"),
                      card_image,
                      "activities"
                    );
                  }
                  bindFilePreview($("#image_card"), $("#card_image_preview"));
                  if (activity_images && activity_images.length) {
                    setImagePreview(
                      $("#activity_images_preview"),
                      activity_images
                        .map((img) => typeof img === 'object' ? (img.image || img.file_name) : img)
                        .filter(Boolean),
                      "activities"
                    );
                  }
                  bindFilePreview($("#images"), $("#activity_images_preview"), {
                    multiple: true,
                  });
                  // initRichEditor();
                  // display highlights
                  if (highlights) {
                    highlights.map((x, i) => {
                      const { highlights } = x;
                      if (i == 0) {
                        $("#pack_highlight .multi input").val(highlights);
                      } else {
                        $("#pack_highlight .add-item").click();
                        $("#pack_highlight .multi")
                          .eq(-1)
                          .find("input")
                          .val(highlights);
                      }
                    });
                  }
                  // display thinks to know
                  if (activity_thinks_to_know) {
                    activity_thinks_to_know.map((x, i) => {
                      const { data } = x;
                      if (i == 0) {
                        $("#thinks_to_know .multi input").val(data);
                      } else {
                        $("#thinks_to_know .add-item").click();
                        $("#thinks_to_know .multi")
                          .eq(-1)
                          .find("input")
                          .val(data);
                      }
                    });
                  }
                  // display includes
                  if (includes) {
                    includes.map((x, i) => {
                      const { includes } = x;
                      if (i == 0) {
                        $("#pack_includes .multi input").val(includes);
                      } else {
                        $("#pack_includes .add-item").click();
                        $("#pack_includes .multi")
                          .eq(-1)
                          .find("input")
                          .val(includes);
                      }
                    });
                  }
                  // display excludes
                  if (excludes) {
                    excludes.map((x, i) => {
                      const { excludes } = x;
                      if (i == 0) {
                        $("#pack_excludes .multi input").val(excludes);
                      } else {
                        $("#pack_excludes .add-item").click();
                        $("#pack_excludes .multi")
                          .eq(-1)
                          .find("input")
                          .val(excludes);
                      }
                    });
                  }
                  // display faq
                  faq.map((x, i) => {
                    const { question, answer } = x;
                    const decodedAnswer = decodeHtml(answer);
                    if (i == 0) {
                      $("#faq .multi input").val(question);
                      $("#faq .multi textarea").val(decodedAnswer);
                    } else {
                      let editorId = Math.random().toString(16).slice(2);
                      $("#faq .add-item")
                        .before(`<div class="multi faq" id="${editorId}" style="flex-wrap : wrap;">
                                <span>Question ${i + 1}</span>
                                 <input type="text" placeholder="Question" value="${question}"  id="question_title" placeholder="" style="width : calc(100% - 50px)" />
                                 <div class="remove">X</div>
                                  <textarea class=""   style="width : calc(100% - 50px); margin-top : 10px;" name="" id="" >${decodedAnswer}</textarea>
                                </div>`);
                      // ClassicEditor.create($('#' + editorId).find('textarea')[0])
                      //     .catch(error => {
                      //         console.error(error);
                      //     });
                      $("#" + editorId)
                        .find(".remove")
                        .click(function () {
                          const parent = $(this).parent();
                          parent.remove();
                        });
                    }
                  });
                }
                initRichEditor();
              });
          });
        const button = new Button($("#save_btn")[0]);
        /* ------------------------------- Edit Activity ------------------------------ */
        $("main")
          .off()
          .on("submit", "#activity_form", function (x) {
            x.preventDefault();
            button.load("Creating");
            const destination = $("#destinations").val();
            const title = $("#title").val();
            const short_title = $("#short_title").val();
            const duration = $("#duration").val();
            const hotel_type = $("#hotel_type").val();
            const cancellation = $("#cancellation").val();
            const transportation = $("#transportation").val();
            const activities = $("#activities").val();
            const discount_amount = $("#discount_amount").val();
            const display_amount = $("#display_amount").val();
            const children_amount = $("#children_amount").val();
            const description = $("#description").val();
            const adult_msg = $("#adult_msg").val();
            const children_msg = $("#children_msg").val();
            const meta = $("#meta").val();
            const validity = $("#validity").val();
            const images = $("#images")[0].files;
            const card_image = $("#image_card")[0].files[0];
            let highlights = [];
            let includes = [];
            let excludes = [];
            let thinks_to_know = [];
            let faq = [];
            let featured = 0;
            if ($("#featured").is(":checked")) {
              featured = 1;
            }
            /* -------------------------------- formdata -------------------------------- */
            let fd = new FormData();
            $("#pack_highlight input").each(function () {
              highlights.push($(this).val());
            });
            $("#thinks_to_know input").each(function () {
              thinks_to_know.push($(this).val());
            });
            $("#pack_includes input").each(function () {
              includes.push($(this).val());
            });
            $("#pack_excludes input").each(function () {
              excludes.push($(this).val());
            });
            $(".faq").each(function () {
              faq.push({
                question: $(this).find("input").val(),
                answer: $(this).find("textarea").val(),
              });
            });
            fd.append("title", title);
            fd.append("short_title", short_title);
            fd.append("description", description);
            fd.append("adult_msg", adult_msg);
            fd.append("children_msg", children_msg);
            fd.append("destination", destination);
            fd.append("duration", duration);
            fd.append("hotel_type", hotel_type);
            fd.append("cancellation", cancellation);
            fd.append("transportation", transportation);
            fd.append("discount_amount", discount_amount);
            fd.append("display_amount", display_amount);
            fd.append("children_amount", children_amount);
            fd.append("activities", activities);
            fd.append("meta", meta);
            fd.append("validity", validity);
            fd.append("featured", featured);
            fd.append("card_image", card_image);
            fd.append("id", id);
            fd.append("highlights", JSON.stringify(highlights));
            fd.append("includes", JSON.stringify(includes));
            fd.append("excludes", JSON.stringify(excludes));
            fd.append("thinks_to_know", JSON.stringify(thinks_to_know));
            fd.append("faq", JSON.stringify(faq));
            for (let i = 0; i < images.length; i++) {
              fd.append("images[]", images[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-tickets.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to update ticket"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/editActivity.php", true);
            xhr.send(fd);

            // fetch('./action/editActivity.php', {
            //     method: 'post',
            //     body: fd
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-activities.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "list-collection",
      beforeEnter() {
        loader.load();
        sidemenu.active("collection");
        header.update(
          "List Collection",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#collection-table")[0]);
        // get all collections
        fetch("action/collections.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const {
                    collection_id,
                    collection_name,
                    createdTime,
                    createdDate,
                    count,
                  } = row;
                  const rowContent = [
                    slno,
                    collection_name,
                    count,
                    createdDate,
                    createdTime,
                  ];

                  table.addRow(rowContent, collection_id);

                  table.actions({
                    edit: "edit-collection.html?id=" + collection_id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteCollection.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the Collection",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.collection_name.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-collection",
      beforeEnter() {
        loader.load();
        sidemenu.active("collection");
        header.update(
          "Add Collection",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        /* ------------------------- fetch all destinations ------------------------- */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
              $(document).ready(function () {
                $("#destinations").CreateMultiCheckBox({
                  width: "100%",
                  defaultText: "Select Below",
                  height: "250px",
                });
              });
            }
          })
          .then(() => {
            /* --------------------------- Add Collection --------------------------- */
            const button = new Button($("#save_btn")[0]);
            $("#collection_form").submit((x) => {
              x.preventDefault();
              button.load("Creating");
              let destinationArray = [];
              const collectionName = $("#collection_name").val();
              $(".cont input:checked").each(function () {
                destinationArray.push($(this).val());
              });
              fetch("./action/addCollection.php", {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  collectionName: collectionName,
                  destinations: destinationArray,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data[0]["status"] == 1) {
                    button.stop();
                    toaster.trigger({
                      content: `${data[0]["msg"]}`,
                      timeout: 2000,
                      type: "success",
                    });
                    barba.go("list-collection.html");
                  } else {
                    button.stop();
                    toaster.trigger({
                      content: `${data[0]["msg"]}`,
                      timeout: 2000,
                      type: "error",
                    });
                  }
                });
            });
          });
      },
    },
    {
      namespace: "edit-collection",
      beforeEnter() {
        loader.load();
        sidemenu.active("collection");
        header.update(
          "Edit Collection",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const collectionId = location.href.split("=")[1];
        /* ------------------------- fetch all destinations ------------------------- */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
              $("#destinations").CreateMultiCheckBox({
                width: "100%",
                defaultText: "Select Below",
                height: "250px",
              });
            }
          });
        /* ------------------- fetch all collection data for edit ------------------- */
        fetch("./action/fetchCollectonEdit.php?id=" + collectionId)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { collection_name, destinations } = data[0];
              $("#collection_name").val(collection_name);
              for (let i = 0; i < destinations.length; i++) {
                const destinationId = destinations[i];
                $(".cont input").each(function () {
                  const $that = $(this);
                  if ($that.val() == destinationId) {
                    $that.attr("checked", true);
                  }
                });
              }
            }
          });
        const button = new Button($("#save_btn")[0]);
        /* ------------------------ updateing collection data ----------------------- */
        $("#collection_form").submit((x) => {
          x.preventDefault();
          button.load("Updating");
          const collectionName = $("#collection_name").val();
          let destinationArray = [];
          $(".cont input:checked").each(function () {
            destinationArray.push($(this).val());
          });
          fetch("./action/editCollection.php", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              collectionName: collectionName,
              destinations: destinationArray,
              collection_id: collectionId,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              button.stop();
              if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-collection.html");
              } else {
                toaster.trigger({
                  content: `${data && data[0] ? data[0]["msg"] : "Failed to update collection"}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              button.stop();
              console.error(err);
              toaster.trigger({
                content: "An error occurred while updating collection",
                timeout: 2000,
                type: "error",
              });
            });
        });
      },
    },
    {
      namespace: "list-blog",
      beforeEnter() {
        loader.load();
        sidemenu.active("blog");
        header.update("List Blog", sidemenu.iconHtml());
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#blog-table")[0]);

        fetch("./action/blogs.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { blog_id, title, date } = row;
                  const rowContent = [slno, title, date];

                  table.addRow(rowContent, blog_id);

                  table.actions({
                    edit: "edit-blog.html?id=" + blog_id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteBlog.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the blog",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.title.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-blog",
      beforeEnter() {
        loader.load();
        sidemenu.active("blog");
        header.update("Add Blog", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();

        let progressBar = new ProgressBar();
        progressBar.init();


        //             tinymce.init({
        //               selector: '.editor',
        //                 plugins: [
        //   'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        //   'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
        //   'media', 'table', 'emoticons', 'template', 'help'
        // ],
        //             });
        createClassicEditor($(".editor")[0]);
        //             tinymce.init({
        //   selector: '.editor'
        // });

        const button = new Button($("#save_btn")[0]);
        $("main")
          .off()
          .on("submit", "#blog_form", function (x) {
            x.preventDefault();

            // tinyMCE.triggerSave();
            button.load("Creating");
            const title = $("#title").val();
            const image = $("#image")[0].files;
            const date = $("#date").val();
            const meta = $("#meta").val();
            const description = $("#description").val();
            let fd = new FormData();
            for (let x = 0; x < image.length; x++) {
              fd.append("image[]", image[x]);
              fd.append("card_image", image[x]);
            }
            fd.append("title", title);
            fd.append("date", date);
            fd.append("meta", meta);
            fd.append("description", description);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
              // $('.progress-bar').width(percent + '%').html(percent.toFixed(2) + '%');
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-blog.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to add blog"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/createBlog.php", true);
            xhr.send(fd);

            // fetch('./action/createBlog.php', {
            //     method: 'post',
            //     body: fd
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-blog.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "edit-blog",
      beforeEnter() {
        loader.load();
        sidemenu.active("blog");
        header.update("Edit Blog", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();

        let progressBar = new ProgressBar();
        progressBar.init();

        const blogId = location.href.split("=")[1];
        //           tinymce.init({
        //               selector: '.editor',
        //                 plugins: [
        //   'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        //   'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
        //   'media', 'table', 'emoticons', 'template', 'help'
        // ],
        //             });
        //             });

        /* ------------------------ fetch blog data for edit ------------------------ */
        fetch("action/fetchBlogEdit.php?id=" + blogId)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            if (data.length) {
              const { title, description, date, meta, images } = data[0];
              $("#title").val(title);

              $("#description").text(description);
              $("#meta").val(decodeHtml(meta));
              $("#date").val(date);
              if (images && images.length) {
                const blogImgs = (Array.isArray(images) ? images : Object.values(images)).map(
                  (img) => typeof img === 'object' ? (img.file_name || img.name || img.image || img) : img
                ).filter(Boolean);
                setImagePreview(
                  $("#blog_images_preview"),
                  blogImgs,
                  "blog"
                );
              }
              bindFilePreview($("#image"), $("#blog_images_preview"), {
                multiple: true,
              });
            }
          })
          .then(() => {
            createClassicEditor($(".editor")[0]);
          });
        const button = new Button($("#save_btn")[0]);
        $("main")
          .off()
          .on("submit", "#blog_form", function (x) {
            x.preventDefault();
            button.load("Updating");
            const title = $("#title").val();
            const image = $("#image")[0].files;
            const date = $("#date").val();
            const meta = $("#meta").val()
            // tinyMCE.triggerSave();;
            const description = $("#description").val();
            let fd = new FormData();
            for (let x = 0; x < image.length; x++) {
              fd.append("image[]", image[x]);
              fd.append("card_image", image[x]);
            }
            fd.append("title", title);
            fd.append("date", date);
            fd.append("description", description);
            fd.append("id", blogId);
            fd.append("meta", meta);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (event) {
              var percent = (event.loaded / event.total) * 100;
              progressBar.progress(percent);
              // $('.progress-bar').width(percent + '%').html(percent.toFixed(2) + '%');
            });
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  try {
                    let data = JSON.parse(xhr.responseText);
                    if (data && data[0] && (data[0]["status"] == 1 || data[0]["status"] == "success")) {
                      button.stop();
                      toaster.trigger({
                        content: `${data[0]["msg"]}`,
                        timeout: 2000,
                        type: "success",
                      });
                      setTimeout(() => {
                        barba.go("list-blog.html");
                      }, 1000);
                    } else {
                      button.stop();
                      toaster.trigger({
                        content: `${data && data[0] ? data[0]["msg"] : "Failed to update blog"}`,
                        timeout: 2000,
                        type: "error",
                      });
                    }
                  } catch (e) {
                    button.stop();
                    console.error(e);
                  }
                } else {
                  button.stop();
                }
              }
            };
            xhr.open("POST", "./action/editBlog.php", true);
            xhr.send(fd);

            // fetch('./action/editBlog.php', {
            //     method: 'post',
            //     body: fd
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data[0]['status'] == 1) {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'success',
            //             });
            //             barba.go('list-blog.html');
            //         } else {
            //             button.stop();
            //             toaster.trigger({
            //                 content: `${data[0]['msg']}`,
            //                 timeout: 2000,
            //                 type: 'error',
            //             });
            //         }
            //     });
          });
      },
    },
    {
      namespace: "list-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Enquiry",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#enquiry_table")[0]);
        fetch("action/enquiry.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { enquiry_id, name, phone, email, enq_type } = row;
                const rowContent = [slno, name, enq_type, email, phone];
                table.addRow(rowContent, enquiry_id);
                table.actions({
                  view: "edit-blog.html?id=" + enquiry_id,
                  // delete: async (id) => {
                  //     const data = {
                  //         id: id
                  //     };
                  //     crued.then(option => {
                  //         option._del_block('action/deleteBlog.php', data).then(response => {
                  //             if (table.rowCount() == 0) {
                  //                 table.empty();
                  //             }
                  //             toaster.trigger({
                  //                 content: 'You have delete the blog',
                  //                 timeout: 2000,
                  //                 type: 'success',
                  //             });
                  //         });
                  //     });
                  // },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          });
      },
    },
    {
      namespace: "enquiry_card",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Enquiry Type",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        /* ------------------------------- fetch count ------------------------------ */
        fetch("./action/fetch_count_enquiry.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const {
                customization_count,
                package_count,
                cart_count,
                contact_count,
                career_count,
                blog_count,
              } = data[0];
              $("#customization_count").text(customization_count);
              $("#package_count").text(package_count);
              $("#cart_count").text(cart_count);
              $("#contact_count").text(contact_count);
              $("#career_count").text(career_count || 0);
              $("#blog_count").text(blog_count || 0);
            }
          });
      },
    },
    {
      namespace: "list-notice",
      beforeEnter() {
        loader.load();
        sidemenu.active("notice");
        header.update("List Notice", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#notice_table")[0]);
        fetch("action/notice.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { notice_id, notice_data, createdDate, createdTime } =
                  row;
                const rowContent = [
                  slno,
                  notice_data,
                  createdDate,
                  createdTime,
                ];
                table.addRow(rowContent, notice_id);
                table.actions({
                  delete: async (id) => {
                    const data = {
                      id: id,
                    };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteNotice.php", data)
                        .then((response) => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete the notice",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          });
      },
    },
    {
      namespace: "add-notice",
      beforeEnter() {
        loader.load();
        sidemenu.active("notice");
        header.update("Add Notice", sidemenu.iconHtml());
        loader.stop();
        logCheck();
        logout();
        const button = new Button($("#save_btn")[0]);
        $("#notice_form").submit((x) => {
          x.preventDefault();
          const notice = $("#notice").val();
          button.load("Creating");
          fetch("action/addNotice.php", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: notice,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data == 1) {
                button.stop();
                barba.go("list-notice.html");
                toaster.trigger({
                  content: "Created successfully",
                  timeout: 2000,
                  type: "success",
                });
              } else {
                button.stop();
                toaster.trigger({
                  content: "Something went wrong!",
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "list-testimonials",
      beforeEnter() {
        loader.load();
        sidemenu.active("testimonial");
        header.update(
          "List Testimonial",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#testimonial-table")[0]);
        // fetch all testimonials
        fetch("./action/testimonials.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { id, name, role, date } = row;
                  const rowContent = [slno, name, role, date];

                  table.addRow(rowContent, id);

                  table.actions({
                    edit: "edit-testimonial.html?id=" + id,
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteTestimonial.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted the Testimonial",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.name.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "add-testimonial",
      beforeEnter() {
        loader.load();
        sidemenu.active("testimonial");
        header.update(
          "Add Testimonial",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const button = new Button($("#save_btn")[0]);
        $("#testimonial-form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const name = $("#name").val();
          const role = $("#role").val();
          const description = $("#description").val();
          const image = $("#Image")[0].files[0];
          let fd = new FormData();
          fd.append("name", name);
          fd.append("role", role);
          fd.append("description", description);
          if (image) {
            fd.append("image", image);
          }
          fetch("./action/addTestimonials.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == "success") {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-testimonials.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "edit-testimonial",
      beforeEnter() {
        loader.load();
        sidemenu.active("testimonial");
        header.update(
          "Edit Testimonial",
          sidemenu.iconHtml()
        );
        loader.stop();
        logCheck();
        logout();
        const id = location.href.split("=")[1];
        /* ----------------------- fetch data edit testimonial ---------------------- */
        fetch("./action/fetchEditTestimonials.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { name, role, description, image } = data[0];
              $("#name").val(name);
              $("#role").val(role);
              $("#description").val(decodeHtml(description));
              if (image) {
                setImagePreview(
                  $("#testimonial_image_preview"),
                  `files/testimonials/${image}`
                );
              }
              bindFilePreview($("#Image"), $("#testimonial_image_preview"));
            }
          });
        const button = new Button($("#save_btn")[0]);
        $("#testimonial-form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const name = $("#name").val();
          const role = $("#role").val();
          const image = $("#Image")[0].files[0];
          const description = $("#description").val();
          let fd = new FormData();
          fd.append("name", name);
          fd.append("role", role);
          fd.append("image", image);
          fd.append("id", id);
          fd.append("description", description);
          fetch("./action/editTestimonials.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == "success") {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-testimonials.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "login",
      beforeEnter() {
        initLoginForm();
      },
    },
    {
      namespace: "list-blog-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Blog Enquiry",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#blog-enq-table")[0]);
        /* ------------------------- fetch all testimonials ------------------------- */
        fetch("./action/enquiryBlogList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, destination_name } = row;
                const rowContent = [slno, name, email, phone, destination_name];
                table.addRow(rowContent, id);
                table.actions({
                  view: "blog-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = {
                      id: id,
                    };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteBlogEnq.php", data)
                        .then((response) => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Enquiry",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          });
      },
    },
    {
      namespace: "blog-enquiry-details",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Blog Enquiry Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        fetch("./action/blogEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { name, email, phone, destination_name } = data[0];
              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              $("#destination").val(destination_name || "Other Location");
            }
          });
      },
    },
    {
      namespace: "list-package-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Package Enquiry",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#package-enq-table")[0]);
        /* ------------------------- fetch all testimonials ------------------------- */
        fetch("./action/enquiryPackageList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, date, package_name } = row;
                const rowContent = [slno, name, email, phone, package_name || "-", date];
                table.addRow(rowContent, id);
                table.actions({
                  view: "package-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = {
                      id: id,
                    };
                    crued.then((option) => {
                      option
                        ._del_block("action/deletePackageEnq.php", data)
                        .then((response) => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Enquiry",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          });
      },
    },
    {
      namespace: "list-contact-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Contact Enquiry",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#contact-enq-table")[0]);
        fetch("./action/enquiryContactList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, subject, date } = row;
                const rowContent = [slno, name, email, phone, subject || "-", date];
                table.addRow(rowContent, id);
                table.actions({
                  view: "contact-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = { id: id };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteContactEnq.php", data)
                        .then(() => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Enquiry",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          })
          .catch(() => {
            table.empty();
            loader.stop();
          });
      },
    },
    {
      namespace: "list-career-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Career Applications",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#career-enq-table")[0]);
        fetch("./action/enquiryCareerList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, position, date } = row;
                const rowContent = [slno, name, email, phone, position || "-", date];
                table.addRow(rowContent, id);
                table.actions({
                  view: "career-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = { id: id };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteCareerEnq.php", data)
                        .then(() => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Application",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          })
          .catch(() => {
            table.empty();
            loader.stop();
          });
      },
    },
    {
      namespace: "list-customization-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Customization Enquiry",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#customization-enq-table")[0]);
        /* ------------------------- fetch all testimonials ------------------------- */
        fetch("./action/enquiryCustomizationList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, destination_name, message } = row;
                const rowContent = [slno, name, email, phone, destination_name, message || "-"];
                table.addRow(rowContent, id, false);
                table.actions({
                  view: "customize-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = {
                      id: id,
                    };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteCustomizeEnq.php", data)
                        .then((response) => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Enquiry",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          })
          .catch((error) => {
            console.error("Failed to load customization enquiries:", error);
            table.empty();
            loader.stop();
          });
      },
    },
    {
      namespace: "list-cart-enquiry",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "List Activity or Ticket Enquiry",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#cart-enq-table")[0]);
        /* ------------------------- fetch all testimonials ------------------------- */
        fetch("./action/enquiryCartList.php")
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              loader.stop();
              let slno = 0;
              data.map((row) => {
                slno++;
                const { id, name, phone, email, item_names } = row;
                const rowContent = [slno, name, email, phone, item_names || "-"];
                table.addRow(rowContent, id, false);
                table.actions({
                  view: "cart-enquiry-details.html?id=" + id,
                  delete: async (id) => {
                    const data = {
                      id: id,
                    };
                    crued.then((option) => {
                      option
                        ._del_block("action/deleteCartEnq.php", data)
                        .then((response) => {
                          if (table.rowCount() == 0) {
                            table.empty();
                          }
                          toaster.trigger({
                            content: "You have delete this Enquiry",
                            timeout: 2000,
                            type: "success",
                          });
                        });
                    });
                  },
                });
              });
            } else {
              table.empty();
              loader.stop();
            }
          });
      },
    },
    {
      namespace: "cart-enquiry-details",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Enquiry Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        $(".enquiry-cart-wrap").empty();
        // fetch enquiry data
        fetch("./action/cartEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { name, email, phone, activity, ticket } = data[0];
              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              activity &&
                activity.map((x) => {
                  const { adult_count, children_count, date, age, title } = x;
                  const childCount = Number(children_count) || 0;
                  let ageBadges = "";
                  if (age && age.length > 0) {
                    ageBadges = age
                      .map((y) => `<span class="age-badge">${y.age}</span>`)
                      .join("");
                  } else if (childCount > 0) {
                    ageBadges = '<span class="age-badge">-</span>';
                  }

                  let template = `
                            <div class="enquiry-card activity">
                            <h3>${title} (Activity)</h3>
                            <div class="content">
                                <div class="detail-item">
                                    <i class="fas fa-users"></i>
                                    <span class="label">Adults:</span>
                                    <span class="value">${adult_count}</span>
                                </div>
                                ${childCount > 0 ? `
                                <div class="detail-item">
                                    <i class="fas fa-child"></i>
                                    <span class="label">Children:</span>
                                    <span class="value">${childCount}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-birthday-cake"></i>
                                    <span class="label">Children Age:</span>
                                    <div class="age-container">${ageBadges}</div>
                                </div>
                                ` : ''}
                                <div class="detail-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span class="label">Date:</span>
                                    <span class="value">${date}</span>
                                </div>
                            </div>
                            </div>`;
                  $(".enquiry-cart-wrap").append(template);
                });
              ticket &&
                ticket.map((x) => {
                  const { adult_count, children_count, date, age, title } = x;
                  const childCount = Number(children_count) || 0;
                  let ageBadges = "";
                  if (age && age.length > 0) {
                    ageBadges = age
                      .map((y) => `<span class="age-badge">${y.age}</span>`)
                      .join("");
                  } else if (childCount > 0) {
                    ageBadges = '<span class="age-badge">-</span>';
                  }

                  let template = `
                            <div class="enquiry-card ticket">
                            <h3>${title} (Ticket)</h3>
                            <div class="content">
                                <div class="detail-item">
                                    <i class="fas fa-users"></i>
                                    <span class="label">Adults:</span>
                                    <span class="value">${adult_count}</span>
                                </div>
                                ${childCount > 0 ? `
                                <div class="detail-item">
                                    <i class="fas fa-child"></i>
                                    <span class="label">Children:</span>
                                    <span class="value">${childCount}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-birthday-cake"></i>
                                    <span class="label">Children Age:</span>
                                    <div class="age-container">${ageBadges}</div>
                                </div>
                                ` : ''}
                                <div class="detail-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span class="label">Date:</span>
                                    <span class="value">${date}</span>
                                </div>
                            </div>
                            </div>`;
                  $(".enquiry-cart-wrap").append(template);
                });
            }
          });
      },
    },
    {
      namespace: "package-enquiry-details",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Enquiry Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        // fetch enquiry data
        fetch("./action/packageEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const {
                name,
                email,
                phone,
                age,
                date,
                package_name,
                notes,
              } = data[0];
              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              $("#package_name").val(package_name || "-");
              $("#notes").val(notes || "");
              $("#date").val(date);
              if (!age) {
                $("#child_age").hide();
              }
              age &&
                age.map((x) => {
                  const { age } = x;
                  let template = ` <span>${age}</span>`;
                  $(".age-wrap").append(template);
                });
            }
          });
      },
    },
    {
      namespace: "career-enquiry-details",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Career Application Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        fetch("./action/careerEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { name, email, phone, position, cover_letter, date, resume } = data[0];
              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              $("#position").val(position || "-");
              $("#cover_letter").val(cover_letter || "");
              $("#date").val(date);
              if (resume) {
                $("#resume-link").html(
                  `<a href="./files/career-resumes/${resume}" target="_blank" class="text-blue-600 hover:underline">${resume}</a>`
                );
              } else {
                $("#resume-holder").hide();
              }
            }
          });
      },
    },
    {
      namespace: "contact-enquiry-details",
      beforeEnter() {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Contact Enquiry Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        fetch("./action/contactEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const { name, email, phone, subject, message, date } = data[0];
              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              $("#subject").val(subject || "-");
              $("#message").val(message || "");
              $("#date").val(date);
            }
          });
      },
    },
    {
      namespace: "customize-enquiry-details",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("enquiry");
        header.update(
          "Enquiry Details",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        loader.stop();
        const id = location.href.split("=")[1];
        // fetch enquiry data
        fetch("./action/customizeEnquiryDetails.php?id=" + id)
          .then((response) => response.json())
          .then((data) => {
            if (data.length) {
              const {
                name,
                email,
                phone,
                adult_count,
                children_count,
                age,
                from_date,
                to_date,
                hotel_type,
                destination_name,
                message,
                picked,
                is_other_location,
              } = data[0];
              const isOtherLocation = !!is_other_location;

              $(".age").empty();
              $(".place").empty();

              $("#name").val(name);
              $("#phone").val(phone);
              $("#email").val(email);
              $("#adult_count").val(adult_count);
              $("#children_count").val(children_count);
              $("#from_date").val(from_date);
              $("#to_date").val(to_date);
              $("#hotel_type").val(hotel_type);
              $("#destination_name").val(destination_name);
              $("#message").val(message || "");

              $(".customize-trip-field").toggleClass("hidden", isOtherLocation);
              $("#message-holder").toggleClass("hidden", !isOtherLocation);

              if (!isOtherLocation) {
                age &&
                  age.map((x) => {
                    const { age } = x;
                    let template = ` <span>${age}</span>`;
                    $(".age").append(template);
                  });
                picked &&
                  picked.map((x) => {
                    const { picked_name, picked_type } = x;
                    let template = ` <span>${picked_name} ( ${picked_type} )</span>`;
                    $(".place").append(template);
                  });
              }
            }
          });
      },
    },
    {
      namespace: "add-partner",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("partners");
        header.update("Add Partner", sidemenu.iconHtml());
        logCheck();
        logout();
        loader.stop();
        const button = new Button($("#save_btn")[0]);
        $("#parner_form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const logo = $("#partner_image")[0].files[0];
          let fd = new FormData();
          fd.append("logo", logo);
          fetch("./action/add_partner.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == "success") {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-partners.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "list-partner",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("partners");
        header.update(
          "List Partners",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#partners-table")[0]);
        // fetch all partners
        fetch("./action/list_partners.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { id, file_name } = row;
                  const image = `<span><img src="./files/partners/${file_name}" width="100px" height="50px"></img></span>`;
                  const rowContent = [slno, image];

                  table.addRow(rowContent, id, false);

                  table.actions({
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deletePartner.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted this Partner",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

          });
      },
    }, {
      namespace: "add-marketing",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("marketing");
        header.update("Add Destination Marketing Images", sidemenu.iconHtml());
        logCheck();
        logout();
        loader.stop();

        /* ------------------------- fetch all main packages ------------------------ */
        fetch("./action/destinations.php")
          .then((response) => response.json())
          .then((data) => {
            $("#destinations")
              .empty()
              .append(`<option value="">Select Destination</option>`);
            if (data.length) {
              data.map((x) => {
                const { destination_id, destination_name } = x;
                $("#destinations").append(
                  `<option value="${destination_id}">${destination_name}</option>`
                );
              });
            }
          });

        const button = new Button($("#save_btn")[0]);
        $("#marketing_form").submit((x) => {
          x.preventDefault();
          button.load("Creating");
          const images = $("#images")[0].files;
          let fd = new FormData();

          for (let x = 0; x < images.length; x++) {
            fd.append('images[]', images[x]);
          }
          fd.append("destination", $('#destinations').val());
          fetch("./action/addMarketingImages.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == "success") {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("marketing.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            });
        });
      },
    },
    {
      namespace: "list-marketing",
      beforeEnter(data) {
        loader.load();
        sidemenu.active("marketing");
        header.update(
          "List Destination Marketing",
          sidemenu.iconHtml()
        );
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#marketing-table")[0]);
        // fetch all items
        fetch("./action/list_marketing.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            // Reusable render function
            const renderTable = (items) => {
              table.clear();

              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { id, destination, image } = row;
                  const image_ = `<div style="width:50px;height:30px"><img width="100%" src="./files/marketing/${image}"></div>`;
                  const rowContent = [slno, destination, image_];

                  table.addRow(rowContent, id, false);

                  table.actions({
                    delete: async (id) => {
                      const deleteData = {
                        id: id,
                      };
                      crued.then((option) => {
                        option
                          ._del_block("action/deleteDestinationMarketing.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted this item",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };

            // Initial render
            renderTable(data);

            // Search Functionality
            $("#search").off("input").on("input", function () {
              const searchTerm = $(this).val().toLowerCase().trim();
              // Check if data is valid before filtering
              if (!data) return;

              if (searchTerm === "") {
                renderTable(data);
              } else {
                const filteredData = data.filter(item =>
                  item.destination.toLowerCase().includes(searchTerm)
                );
                renderTable(filteredData);
              }
            });

          });
      },
    },
    {
      namespace: "list-posters",
      beforeEnter() {
        loader.load();
        sidemenu.active("poster");
        header.update("List Posters", sidemenu.iconHtml());
        logCheck();
        logout();
        const crued = import("../server/CRUED.js");
        let table = new Table($("#poster-table")[0]);

        fetch("action/posters.php")
          .then((response) => response.json())
          .then((data) => {
            loader.stop();

            const renderTable = (items) => {
              table.clear();
              if (items.length) {
                let slno = 0;
                items.forEach((row) => {
                  slno++;
                  const { id, image } = row;
                  const posterImg = `<div style="width:100px;height:40px"><img width="100%" height="100%" style="object-fit:cover" src="./files/posters/${image}"></div>`;
                  const rowContent = [slno, posterImg];

                  table.addRow(rowContent, id, false);

                  table.actions({
                    delete: async (id) => {
                      const deleteData = { id: id };
                      crued.then((option) => {
                        option
                          ._del_block("action/deletePoster.php", deleteData)
                          .then((response) => {
                            if (table.rowCount() == 0) {
                              table.empty();
                            }
                            toaster.trigger({
                              content: "You have deleted this poster",
                              timeout: 2000,
                              type: "success",
                            });
                          });
                      });
                    },
                  });
                });
              } else {
                table.empty();
              }
            };
            renderTable(data);
          })
          .catch(err => {
            loader.stop();
            console.error(err);
            toaster.trigger({
              content: "Failed to fetch posters",
              timeout: 2000,
              type: "error",
            });
          });
      },
    },
    {
      namespace: "add-poster",
      beforeEnter() {
        loader.load();
        sidemenu.active("poster");
        header.update("Add Poster", sidemenu.iconHtml());
        logCheck();
        logout();
        loader.stop();

        const button = new Button($("#save_btn")[0]);
        $("#poster_form").submit((x) => {
          x.preventDefault();
          button.load("Adding");
          const posterImage = $("#posterImage")[0].files[0];
          let fd = new FormData();
          fd.append("posterImage", posterImage);

          fetch("./action/addPoster.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data[0]["status"] == 1) {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "success",
                });
                barba.go("list-posters.html");
              } else {
                button.stop();
                toaster.trigger({
                  content: `${data[0]["msg"]}`,
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch(err => {
              button.stop();
              console.error(err);
              toaster.trigger({
                content: "An error occurred while adding the poster",
                timeout: 2000,
                type: "error",
              });
            });
        });
      },
    },
    {
      namespace: "change-password",
      beforeEnter() {
        loader.load();
        sidemenu.active("change-password");
        header.update("Change Password", sidemenu.iconHtml());
        logCheck();
        logout();
        loader.stop();

        const button = new Button($("#save_btn")[0]);
        $("#change_password_form").submit((x) => {
          x.preventDefault();

          const oldPassword = $("#old_password").val();
          const newPassword = $("#new_password").val();
          const confirmPassword = $("#confirm_password").val();

          if (newPassword !== confirmPassword) {
            toaster.trigger({
              content: "New passwords do not match!",
              timeout: 3000,
              type: "error",
            });
            return;
          }

          button.load("Updating");

          let fd = new FormData();
          fd.append("old_password", oldPassword);
          fd.append("new_password", newPassword);

          fetch("./action/changePassword.php", {
            method: "post",
            body: fd,
          })
            .then((response) => response.json())
            .then((data) => {
              button.stop();
              if (data.status === "success" || data.status === 1 || data[0]?.status == 1) {
                // Handle various response interfaces seen in this codebase
                toaster.trigger({
                  content: data.msg || data[0]?.msg || "Password updated successfully",
                  timeout: 2000,
                  type: "success",
                });
                $("#change_password_form")[0].reset();
              } else {
                toaster.trigger({
                  content: data.msg || data[0]?.msg || "Failed to update password",
                  timeout: 2000,
                  type: "error",
                });
              }
            })
            .catch(err => {
              button.stop();
              toaster.trigger({
                content: "An error occurred",
                timeout: 2000,
                type: "error",
              });
              console.error(err);
            });
        });

        // Toggle password visibility
        $(".toggle-password").click(function () {
          const targetId = $(this).data("target");
          const input = $(targetId);
          const icon = $(this).find("i");

          if (input.attr("type") === "password") {
            input.attr("type", "text");
            icon.removeClass("fa-eye-slash").addClass("fa-eye");
          } else {
            input.attr("type", "password");
            icon.removeClass("fa-eye").addClass("fa-eye-slash");
          }
        });
      },
    },
  ],
});
function logCheck() {
  fetch("action/checkLoginAdmin.php")
    .then((response) => response.json())
    .then((data) => {
      if (data[0]["info"] != "true") {
        location.replace("./index.html");
      }
    })
    .catch(() => {
      // Keep page usable if auth check fails transiently
    });
}
function logout() {
  $(".logout")
    .off("click.adminLogout")
    .on("click.adminLogout", (x) => {
      x.preventDefault();
      fetch("action/logout.php")
        .then((response) => response.json())
        .then((data) => {
          if (data == 1) {
            location.href = "./index.html";
          }
        });
    });
}

// Keep loader/UI consistent across Barba page swaps
barba.hooks.before(() => {
  loader.load();
});
barba.hooks.beforeEnter((data) => {
  const isLogin = data?.next?.namespace === "login";
  $("nav.sidemenu, body > header").toggle(!isLogin);
});
barba.hooks.after(() => {
  loader.stop();
  logout();
});

function safeHeaderUpdate(title, linkRef) {
  if (linkRef) {
    sidemenu.active(linkRef);
  }
  header.update(title, sidemenu.iconHtml());
}

function initLoginForm() {
  $(document).off("submit.adminLogin", "#login_form").on("submit.adminLogin", "#login_form", function (x) {
    x.preventDefault();
    const username = $("#userName").val() || "";
    const password = $("#password").val() || "";
    fetch("./action/loginAction.php", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        const result = String(data).trim();
        if (result === "1" || result.includes('"status":1')) {
          location.href = "dashboard.html";
        } else {
          $(".error").show();
          alert("invalid username or password");
        }
      })
      .catch((err) => {
        console.error("Login fetch error:", err);
        alert("Login request failed: " + err);
      });
  });
}

// Hide admin chrome and initialize login form handler on hard-refresh of login page
if ($('[data-barba-namespace="login"]').length) {
  $("nav.sidemenu, body > header").hide();
  loader.stop();
  initLoginForm();
}

