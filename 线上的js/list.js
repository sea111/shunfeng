function contextHeight() {
    var e = 0;
    return $.each(arguments, function (t, a) {
        e += 1 * $(a).height()
    }),
    document.documentElement.clientHeight - e
}
$(function () {
    function e(s, l, i, o, c, r, n) {
        WPBridge.callMethod("JsInvokeNative", "wpEncrypt", {
            key: s,
            params: [a, 1, r, l]
        }, function (a) {
            codeValue = a.data.result,
            $.ajax({
                type: "post",
                url: wpCommon.Url + "/wpwl/product/listByPage",
                dataType: "json",
                cache: !1,
                data: {
                    brandId: codeValue[0],
                    categoryId: codeValue[3],
                    pageIndex: codeValue[1],
                    pageSize: codeValue[2],
                    versionId: "27"
                },
                async: !0,
                success: function (a) {
                    if ("AES加密解密失败" == a.errMsg) {
                        aesFail || ($.ajax({
                            type: "post",
                            url: wpCommon.Url + "/wpwl/getKey",
                            success: function (t) {
                                s = t.data,
                                localStorage.setItem("key", t.data),
                                e(s)
                            }
                        }), aesFail = !0)
                    } else {
                        if (a.success) {
                            str = "";
                            var l = a.data.list;
                            str += '<ul class="ul">',
                            str += "<p class='backG'></p>",
                            str += 1 == n ? '<li class="li listTitle" resultName="' + i.categoryName + '" resultid="' + i.categoryId + '"><i class="bgLift">' + i.categoryName + "</i></li>" : '<li class="li listTitle" resultName="' + i.categoryName + '" resultid="' + i.categoryId + '"><i class="bgLift">' + i.categoryName + '</i><span resultName="' + i.categoryName + '" resultid=' + i.categoryId + ' class="more">更多</span><i resultName="' + i.categoryName + '" resultid=' + i.categoryId + ' class="bgRight"></i></li>',
                            str += '<li class="two"><i class="lineL"></i><span class="center"></span><i class="lineR"></i></li>',
                            str += '<li class="three">';
                            for (var r in l) {
                                l.length > 1 ? "1" == l[r].saleStatus ? (str += '<dl dataid="' + l[r].productId + '">', str += '<dt><i class="hot"></i><img src="' + l[r].iconUrl + '" /></dt><dd><p class="lines"></p><p searchName="' + l[r].productName + '" class="p1">' + l[r].productName + '</p><p class="p2">' + l[r].standard + "</p></dd>", str += "</dl>") : str += "<dl dataid=" + l[r].productId + '><dt><img src="' + l[r].iconUrl + '" /></dt><dd><p class="lines"></p><p searchName="' + l[r].productName + '" class="p1">' + l[r].productName + '</p><p class="p2">' + l[r].standard + "</p></dd></dl>" : (str += "<dl dataid=" + l[r].productId + '><dt><img src="' + l[r].iconUrl + '" /></dt><dd><p class="lines"></p><p searchName="' + l[r].productName + '" class="p1">' + l[r].productName + '</p><p class="p2">' + l[r].standard + "</p></dd></dl>", str += '<div class="end"></div>')
                            }
                            str += "</li>",
                            str += "</ul>",
                            $(".con").append(str),
                            Iscroll.scroll(),
                            t(),
                            WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {}, function () {}),
                            WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {}, function () {}),
                            c && c(o)
                        } else {
                            $("#wrongs").show()
                        }
                    }
                },
                error: function (e) {
                    WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {}, function () {}),
                    WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {}, function () {})
                }
            })
        })
    }
    function t() {
        $(".con dl ").on("click", function () {
            var e = $(this).attr("dataid"),
                t = $(this).attr("searchName");
            localStorage.setItem("searchName", t),
            window.location.href = "detail.html?&type=1&pageId=H5_A008&productId=" + e
        })
    }
    WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {}, function () {}),
    window.aesFail = "";
    var a = localStorage.getItem("brandid"),
        s = (localStorage.getItem("resultName"), localStorage.getItem("resultid"), localStorage.getItem("brandname"));
    $(".name").html(s),
    $.ajax({
            type: "post",
            url: wpCommon.Url + "/wpwl/getKey",
            success: function (e) {
                key = e.data,
                localStorage.setItem("key", e.data),
                i.getMes()
            }
        });
    var l = new Array,
        i = {
            getMes: function (t) {
                l = new Array;
                WPBridge.callMethod("JsInvokeNative", "wpEncrypt", {
                    key: key,
                    params: [a, 1, 20]
                }, function (t) {
                    codeValue = t.data.result,
                    $.ajax({
                        type: "post",
                        url: wpCommon.Url + "/wpwl/category/listByPage",
                        data: {
                            brandId: codeValue[0],
                            pageIndex: codeValue[1],
                            pageSize: codeValue[2]
                        },
                        async: !0,
                        success: function (t) {
                            function a(t) {
                                var l = t + 1;
                                s[l] && e(key, s[l].categoryId, s[l], l, a, 2)
                            }
                            if ("AES加密解密失败" == t.errMsg) {
                                aesFail || ($.ajax({
                                    type: "post",
                                    url: wpCommon.Url + "/wpwl/getKey",
                                    success: function (t) {
                                        key = t.data,
                                        localStorage.setItem("key", t.data),
                                        e(key)
                                    }
                                }), aesFail = !0)
                            } else {
                                var s = t.data.list;
                                1 == s.length ? e(key, s[0].categoryId, s[0], 0, a, 1000, 1) : e(key, s[0].categoryId, s[0], 0, a, 2)
                            }
                        }
                    })
                })
            }
        };
    $(".search").click(function () {
            document.activeElement.blur(),
            window.location.href = "search.html?pageId=H5_A000"
        }),
    $(".con").on("click", "ul .more", function () {
            var e = $(this).attr("resultName"),
                t = $(this).attr("resultid");
            localStorage.setItem("resultName", e),
            localStorage.setItem("resultid", t),
            window.location.href = "result.html?pageId=H5_A007&otherId=" + t
        }),
    $(".con").on("click", "ul .bgRight", function () {
            var e = $(this).attr("resultName"),
                t = $(this).attr("resultid");
            localStorage.setItem("resultName", e),
            localStorage.setItem("resultid", t),
            window.location.href = "result.html?pageId=H5_A007&otherId=" + t
        })
}),
$(function () {
    $(".back").click(function () {
        WPBridge.callMethod("JsInvokeNative", "wpFinishH5", {}, function () {})
    })
}),
$(function () {
    myScroll = new IScroll("#content", {
        click: !0,
        fixedScrollbar: !0,
        disableTouch: !1,
        disablePointer: !0,
        mouseWheel: !0,
        disableMouse: !1,
        scrollBars: !0,
        probeType: 3
    }),
    myScroll.on("scroll", function () {
        if (this.y >= 0) {
            $(".backG").hide(),
            $(".ul").eq(0).find(".listTitle").css({
                position: "relative",
                top: "0rem",
                zIndex: 1
            })
        } else {
            var e = this,
                t = $(".ul").height();
            $(".ul").each(function (a) {
                    Math.abs(e.y) > a * t && Math.abs(e.y) < (a + 1) * t ? ($(this).find(".backG").show(), 0 == a ? $(this).find(".listTitle").css({
                        position: "fixed",
                        zIndex: 100000000,
                        top: Math.abs(e.y) - 12 + "px",
                        background: "white"
                    }) : $(this).find(".listTitle").css({
                        position: "fixed",
                        zIndex: 100000000,
                        top: Math.abs(e.y) - 1 + "px",
                        background: "white"
                    })) : ($(this).find(".backG").hide(), $(this).find(".listTitle").css({
                        position: "relative",
                        zIndex: 1,
                        top: 0
                    }))
                })
        }
    }),
    document.addEventListener("touchmove", function (e) {
        e.preventDefault()
    }, !1)
});
var Iscroll = {
    scroll: function () {
        var e = contextHeight("#head", ".search");
        $("#content").css("height", e + "px"),
        myScroll.refresh()
    }
};