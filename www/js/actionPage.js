App.initialize();
App.onDeviceReady();
$(function() {
    $(document).delegate('#submitLogin-page', 'pagebeforeshow', function() {
        getCollection();
        $('#form_create_site ')[0].reset();
    });
    $(document).delegate('#submitLogin-page li', 'click', function() {
        var cId = $(this).attr("data-id");
        localStorage.setItem("cId", cId);
    });
    $(document).delegate('#page-site-list', 'pagebeforeshow', function() {
        cId = localStorage.getItem("cId");
        getSiteByCollectionId(cId);
    });
    $(document).delegate('#page-site-list', 'pageshow', function() {
        $("#site-list").listview("refresh");
    });
    $(document).delegate('#page-site-list li', 'click', function() {
        var sId = $(this).attr("data-id");
        localStorage.setItem("sId", sId);
    });
    $(document).delegate('#btn_delete-site', 'click', function() {
        var sId = localStorage.getItem("sId");
        deleteSiteBySiteId(sId);
    });
    $(document).delegate('#page-list-view-site', 'pagebeforeshow', function() {
        var currentUser = getCurrentUser();
        getSiteByUserId(currentUser.id);
    });
    $(document).delegate('#page-list-view-site', 'pageshow', function() {
        $("#offlinesite-list").show();
        $("#offlinesite-list").listview("refresh");
    });
    $(document).delegate('#page-list-view-site li', 'click', function() {
        var sId = $(this).attr("data-id");
        localStorage.setItem("sId", sId);
    });
    $(document).delegate('#logout', 'click', function() {
        logout();
    });
    $(document).delegate('#page-create-site', 'pagebeforeshow', function() {
        getFieldsCollection();
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (lat =="" && lng == "") {
            navigator.geolocation.getCurrentPosition(function(pos) {
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                $("#lat").val(lat);
                $("#lng").val(lng);
                $("#mark_lat").val(lat);
                $("#mark_lng").val(lng);
            });
        }
    });
    $(document).delegate('#create-icon-map', 'click', function() {
        $("#updateLatLng_page_map").hide();
        $("#cancelupdateLatLng_page_map").hide();
        $("#btn_back_create_site").show();
    });
    $(document).delegate('#btn_sendToServer', 'click', function() {
        cId = localStorage.getItem("cId");
        sendSiteToServer("collection_id", cId);
    });
    $(document).delegate('#btn_sendToServerAll', 'click', function() {
        var currentUser = getCurrentUser();
        sendSiteToServer("user_id", currentUser.id);
    });
    $(document).delegate('#page-update-site', 'pagebeforeshow', function() {
        renderUpdateSiteForm();
    });
    $(document).delegate('#btn_submitUpdateSite', 'click', function() {
        sId = localStorage.getItem("sId");
        updateSiteBySiteId(sId);
        location.href = "#page-site-list";
    });
    $(document).delegate('#update_icon_map', 'click', function() {
        $("#updateLatLng_page_map").show();
        $("#cancelupdateLatLng_page_map").show();
        $("#btn_back_create_site").hide();
        $("#mark_lat").val($("#updatelolat").val());
        $("#mark_lng").val($("#updatelolng").val());
    });
    $(document).delegate('#updateLatLng_page_map', 'click', function() {
        sId = localStorage.getItem("sId");
        updateLatLngBySiteId(sId);
    });
    $(document).delegate('#cancelupdateLatLng_page_map', 'click', function() {
        location.href = "#page-update-site";
    });
    $(document).delegate('#page-map', 'pageshow', function() {
        var lat = $("#mark_lat").val();
        var lng = $("#mark_lng").val();
        var latlng = new google.maps.LatLng(lat, lng);
        var options = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var $content = $("#map_canvas");
        $content.height(screen.height - 200);
        var map = new google.maps.Map($content[0], options);
        $.mobile.changePage($("#page-map"));
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latlng,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function() {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $("#updatelolat").val(lat);
            $("#updatelolng").val(lng);
            $("#lat").val(lat);
            $("#lng").val(lng);
            $("#mark_lat").val(lat);
            $("#mark_lng").val(lng);
        });
        var markerBounds = new google.maps.LatLngBounds();
        markerBounds.extend(latlng);
        map.fitBounds(markerBounds);
        google.maps.event.trigger(map_canvas, 'resize');
    });
});