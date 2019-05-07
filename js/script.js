
$(document).ready(function () {
    var detailWin = $("#detail-window").kendoWindow({
        width: '100%',
        height: '100%',
        title: '詳細說明',
        scrollable: true,
        visible: false,
        actions: [
            'Close'
        ]
    }).data('kendoWindow');

    $("#ddtType").kendoDropDownTree({
        placeholder: "請選擇...",
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: dsType
    });

    $("#ddtClass").kendoDropDownTree({
        placeholder: "請選擇...",
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: dsClass
    });

    $("#ddtStars").kendoDropDownTree({
        placeholder: "請選擇...",
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: dsStars
    });

    $("#ddlCost").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: dsCost,
        index: 0,
    });

    $("#ddtSockets").kendoDropDownTree({
        placeholder: "請選擇...",
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: dsSockets
    });

    $("#ddtDrops").kendoDropDownTree({
        placeholder: "請選擇...",
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: dsDrops
    });

    $("#CardGrid").kendoGrid({
        dataSource: {
            data: null,
            schema: {
                model: {
                    fields: {
                        CardNo: { type: "string" },
                        Icon: { type: "string" },
                        Type: { type: "string" },
                        Class: { type: "string" },
                        Stars: { type: "string" },
                        Cost: { type: "string" },
                        Sockets: { type: "string" },
                        MAXLV: { type: "string" },
                        Status: { type: "string" },
                        SkillCD: { type: "string" },
                        ToGet: { type: "string" },
                        Book: { type: "string" },
                        Liberation: { type: "string" },
                        SkillDesc: { type: "string" },
                        CapDesc: { type: "string" },
                        CrewDesc: { type: "string" },
                        BreakTrough: { type: "string" },
                        Evolutions: { type: "string" },
                    }
                }
            },
            pageSize: 20,
        },
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "CardNo", title: "ID", width: "10%" },
            {
                field: "Icon", title: "圖像", width: "10%"
                , template: function (dataItem) {
                    return dataItem.Icon;
                }
            },
            {
                field: "Type", title: "屬性", width: "10%"
                , template: function (dataItem) {
                    return dataItem.Type;
                }
            },
            {
                field: "Class", title: "Type", width: "10%"
                , template: function (dataItem) {
                    return dataItem.Class;
                }
            },
            { field: "Stars", title: "★數", width: "10%" },
            { field: "Cost", title: "cost", width: "10%" },
            { field: "Sockets", title: "插槽數", width: "10%" },
            { field: "MAXLV", title: "最大等級", width: "10%" },
            {
                field: "Status", title: "體力<br>攻擊<br>回復", width: "10%"
                , template: function (dataItem) {
                    return dataItem.Status;
                }
            },
            {
                field: "SkillCD", title: "技能CD", width: "10%", template: function (dataItem) {
                    return dataItem.SkillCD;
                }
            },
            { hidden: true, field: "ToGet", title: "角色取得方式", width: "0%" },
            { hidden: true, field: "Book", title: "必殺技/練等關卡", width: "0%" },
            { hidden: true, field: "Liberation", title: "可練解放關卡", width: "0%" },
            { hidden: true, field: "SkillDesc", title: "必殺技", width: "0%" },
            { hidden: true, field: "CapDesc", title: "船長效果", width: "0%" },
            { hidden: true, field: "CrewDesc", title: "船員效果", width: "0%" },
            { hidden: true, field: "BreakTrough", title: "突破效果", width: "0%" },
            { hidden: true, field: "Evolutions", title: "進化素材", width: "0%" }
        ]
    });

    $(".btn-search").click(function () {
        Search();
    });

    $(".btn-clear").click(function () {
        Clear();
    });

    var grid = $("#CardGrid").data("kendoGrid");
    $(grid.tbody).on("click", "td", function (e) {
        var row = $(this).closest("tr");;
        var item = grid.dataItem(row);

        $("#lblToGet").text(item.ToGet);
        $("#lblBook").text(item.Book);
        $("#lblLiberation").text(item.Liberation);
        $("#lblSkillDesc").text(item.SkillDesc);
        $("#lblCapDesc").text(item.CapDesc);
        $("#lblCrewDesc").text(item.CrewDesc);
        $("#lblBreakTrough").text(item.BreakTrough);
        $("#lblEvolutions").html(item.Evolutions);

        detailWin.center().open();
    });

    function Search() {
        var TypeValue = GetArrToStr($("#ddtType").data("kendoDropDownTree").value());
        var ClassValue = GetArrToStr($("#ddtClass").data("kendoDropDownTree").value());
        var StarsValue = GetArrToStr($("#ddtStars").data("kendoDropDownTree").value());
        var CostValue = $("#ddlCost").data("kendoDropDownList").value().replace('All', '');
        var SocketsValue = GetArrToStr($("#ddtSockets").data("kendoDropDownTree").value());
        var DropsValue = GetArrToStr($("#ddtDrops").data("kendoDropDownTree").value());
        var CardNo = $("#txtCardNo").val().replace(' ', '**');

        if ((TypeValue === '')
            && (ClassValue === '')
            && (StarsValue === '')
            && (CostValue === '')
            && (socketsValue === '')
            && (dropsValue === '')
            && (CardNo.trim() === '')) {
            $('#result').empty();
            $('#result').hide();
            return;
        }
        var SelStr = CardNo + '##' + TypeValue + '##' + ClassValue + '##' + StarsValue + '##' + CostValue + '##' + SocketsValue + '##' + DropsValue;
        Process(SelStr);
    }

    function Process(value) {
        var arrVal = value.split('##');

        $.each(window.units, function (o) {
            var CardNo = o + 1;
            try {
                if (IsEqual(CardNo, arrVal[0], 'CardNo')
                    && IsEqual(window.units[o][1], arrVal[1], 'Type')
                    && IsEqual(window.units[o][2], arrVal[2], 'Class')
                    && IsEqual(window.units[o][3], arrVal[3], 'Stars')
                    && ChkCost(window.units[o][4], arrVal[4]) // Cost
                    && IsEqual(window.units[o][6], arrVal[5], 'sockets')
                    && ChkDrops(CardNo, arrVal[6]) // drops
                ) {
                    var newRow = {
                        "CardNo": CardNo,
                        "Icon": Icon(CardNo),
                        "Type": SetTypeStyle(window.units[o][1]),
                        "Class": SetClassStyle(window.units[o][2]),
                        "Stars": window.units[o][3],
                        "Cost": window.units[o][4],
                        "Sockets": window.units[o][6],
                        "MAXLV": window.units[o][7],
                        "Status": GetStatus(window.units[o][12], window.units[o][13], window.units[o][14]),
                        "SkillCD": GetSkillCD(window.cooldowns[o]),
                        "ToGet": GetData(CardNo, 'TO_GET'),
                        "Book": GetData(CardNo, 'BOOK'),
                        "Liberation": GetData(CardNo, 'LIBERATION'),
                        "SkillDesc": GetData(CardNo, 'SKILL_DESC'),
                        "CapDesc": GetData(CardNo, 'CAP_DESC'),
                        "CrewDesc": GetData(CardNo, 'CREW_DESC'),
                        "BreakTrough": GetData(CardNo, 'BREAK_THROUGH'),
                        "Evolutions": GetEvolutions('進化素材', CardNo)
                    };
                    var grid = $("#CardGrid").data("kendoGrid");
                    grid.dataSource.add(newRow);
                }
            } catch (e) {
                alert(CardNo + ', ' + e.toString());
            }
        });
    }

    function Clear() {
        $("#ddtType").data("kendoDropDownTree").value([]);
        $("#ddtClass").data("kendoDropDownTree").value([]);
        $("#ddtStars").data("kendoDropDownTree").value([]);
        $("#ddlCost").data("kendoDropDownList").select(0);
        $("#ddtSockets").data("kendoDropDownTree").value([]);
        $("#ddtDrops").data("kendoDropDownTree").value([]);
        $("#txtCardNo").val('');
        $("#CardGrid").data('kendoGrid').dataSource.data([]);
    }

    function Icon(id) {
        if (id == '0000')
            return '<img class="icon" src="icon/icon_arror.jpg">';
        var strID = 'f' + ('0000' + id).substr(-4) + '.png';
        return GetIconUrl(strID);
    }

    function GetIconUrl(FileName) {
        var url1 = 'https://onepiece-treasurecruise.com/wp-content/uploads/' + FileName;
        var url2 = 'https://gamewith.akamaized.net/article_tools/onepiece/gacha/' + FileName;
        // return '<img class="icon" src="' + url1 + '" onerror=\"this.src=\''+ url2 + '\'\">';
        return '<img class="icon" src="' + url1 + '" >';
    }

    function GetSkull(id) {
        switch (id) {
            case 'skullLuffy':
                return GetIconUrl('skull_luffy.png');
                break;
            case 'skullZoro':
                return GetIconUrl('skull_zoro.png');
                break;
            case 'skullNami':
                return GetIconUrl('skull_nami.png');
                break;
            case 'skullUsopp':
                return GetIconUrl('skull_usopp_f.png');
                break;
            case 'skullSanji':
                return GetIconUrl('skull_sanji_f.png');
                break;
            case 'skullChopper':
                return GetIconUrl('skull_chopper_f.png');
                break;
            case 'skullRobin':
                return GetIconUrl('skull_robin_f.png');
                break;
            case 'skullFranky':
                return GetIconUrl('skull_franky_f.png');
                break;
            case 'skullBrook':
                return GetIconUrl('skull_brook_f.png');
                break;
            case 'skullSTR':
                return GetIconUrl('red_skull_f.png');
                break;
            case 'skullQCK':
                return GetIconUrl('blue_skull_f.png');
                break;
            case 'skullPSY':
                return GetIconUrl('yellow_skull2_f.png');
                break;
            case 'skullDEX':
                return GetIconUrl('green_skull2_f.png');
                break;
            case 'skullINT':
                return GetIconUrl('black_skull_f.png');
                break;
            case 'skullEnel':
                return GetIconUrl('enel_skull_f.png');
                break;
            case 'skullJudge':
                return GetIconUrl('Jerma_skull_f1.png');
                break;
            case 'skullReiju':
                return GetIconUrl('Jerma_skull_f2.png');
                break;
            case 'skullIchiji':
                return GetIconUrl('Jerma_skull_f3.png');
                break;
            case 'skullNiji':
                return GetIconUrl('Jerma_skull_f4.png');
                break;
            case 'skullYonji':
                return GetIconUrl('Jerma_skull_f5.png');
                break;
            case 'skullHiguma':
                return GetIconUrl('higuma_skull_f.png');
                break;
        }
        return '';
    }

    function SetTypeStyle(o) {
        var rtnValue = "";
        try {
            $.each(o, function (data) {
                rtnValue += ProcType(o[data]);
            });
        } catch (e) {
            rtnValue = ProcType(o);
        }
        return '<strong>' + rtnValue + '</strong>';
    }

    function ProcType(o) {
        var fcolot = "";
        var str = "";
        switch (o) {
            case 'STR':
                str = "力";
                fcolor = "red";
                break;
            case 'QCK':
                str = "速";
                fcolor = "blue";
                break;
            case 'DEX':
                str = "技";
                fcolor = "green";
                break;
            case 'PSY':
                str = "心";
                fcolor = "orange";
                break;
            case 'INT':
                str = "知";
                fcolor = "purple";
                break;
        }
        return '<font color="' + fcolor + '">' + str + '</font>';
    }

    function SetClassStyle(o) {
        var str = "";
        try {
            $.each(o, function (data) {
                try {
                    $.each(o[data], function (child) {
                        if (str)
                            str += '<br>';
                        str += ProcClass(o[data][child]);
                    });
                } catch (ex) {
                    if (str)
                        str += '<br>';
                    str += ProcClass(o[data]);
                }
            });
        } catch (e) {
            str = ProcClass(o);
        }
        return str;
    }

    function ProcClass(o) {
        var str = "";
        switch (o) {
            case 'Fighter':
                str = "格鬪";
                break;
            case 'Slasher':
                str = "斬擊";
                break;
            case 'Striker':
                str = "打突";
                break;
            case 'Shooter':
                str = "射擊";
                break;
            case 'Free Spirit':
                str = "自由";
                break;
            case 'Cerebral':
                str = "博識";
                break;
            case 'Driven':
                str = "野心";
                break;
            case 'Powerhouse':
                str = "強韌";
                break;
        }
        return str;
    }

    function GetSkillCD(o) {
        var LV1 = 0;
        var LVMAX = 0;
        if (o == null)
            return '';
        else {
            try {
                $.each(o, function (data) {
                    if (data == 0)
                        LV1 = parseInt(o[data]);
                    else
                        LVMAX = parseInt(o[data]);
                });
            } catch (e) {
                LV1 = parseInt(o);
            }
        }

        if (LVMAX == 0)
            return LV1;
        else
            return LV1 + '<br> ↓ <br>' + LVMAX;
    }

    function GetStatus(HP, ATK, CURE) {
        return HP + '<br>' + ATK + '<br>' + CURE;
    }

    function GetEvolutions(TITLE, VALUE) {
        var str = '';
        var icon = '';
        $.each(window.evolutions, function (i, data) {
            if (i == VALUE) {
                for (var i in data.evolvers) {
                    if (data.evolvers[i].length > 0) {
                        if ($.isNumeric(data.evolvers[i])) {
                            for (var j in data.evolvers[i]) {
                                icon += Icon(data.evolvers[i][j]);
                            }
                            if (icon.length > 0) {
                                icon += Icon('0000') + Icon(data.evolution[i]) + '<br>';
                            }
                        } else {
                            var strSkull = GetSkull(data.evolvers[i]);
                            icon += strSkull;
                        }
                    } else {
                        icon += Icon(data.evolvers[i]);
                    }
                }
            }
        });
        str += icon;

        if (icon == '')
            str = '';
        return str;
    }

    function IsEqual(A, B, kind) {
        if (B.trim() == '')
            return true;
        if (A == null)
            return false;
        var arrB = B.split('**');
        for (i = 0; i < arrB.length; i++) {
            if (arrB[i].trim() == '')
                continue;
            switch (kind) {
                case 'CardNo':
                case 'sockets':
                    if (A == parseInt(arrB[i]))
                        return true;
                    break;
                case 'Stars':
                    if (A.toString() == arrB[i])
                        return true;
                    break;
                default:
                    if (A.indexOf(arrB[i]) > -1 && arrB[i].length > 0)
                        return true;
            }
        }
        return false;
    }

    function ChkCost(A, kind) {
        if (kind == 'less20') {
            return A <= 20;
        } else if (kind == 'over50') {
            return A >= 50;
        } else {
            return true;
        }
    }

    function ChkDrops(id, kind) {
        if (isNaN(id) || kind == '')
            return true;

        for (var type in window.drops) {
            switch (type) {
                case 'Story Island':
                case 'Fortnight':
                case 'Raid':
                    if (type == kind.trim()) {
                        for (var island = 0; island < window.drops[type].length; ++island) {
                            for (var stage in window.drops[type][island]) {
                                if (stage == 'thumb' || stage == 'name' || stage == 'shortName' || stage == 'day' || stage == 'global' || stage == 'condition' || stage == 'completion' || stage == 'challenge' || stage == 'challengeData' || stage == 'showManual' || stage == 'gamewith' || stage == 'teamDatabase') continue;
                                if (window.drops[type][island][stage].indexOf(id) != -1) {
                                    return true;
                                }
                            }
                        }
                    }
                    break;
                case 'Special':
                    for (var island = 0; island < window.drops[type].length; ++island) {
                        if (window.drops[type][island].name == kind.trim()) {
                            for (var stage in window.drops[type][island]) {
                                if (stage == 'thumb' || stage == 'name' || stage == 'shortName' || stage == 'day' || stage == 'global' || stage == 'condition' || stage == 'completion' || stage == 'challenge' || stage == 'challengeData' || stage == 'showManual' || stage == 'gamewith' || stage == 'teamDatabase') continue;
                                if (window.drops[type][island][stage].indexOf(id) != -1) {
                                    return true;
                                }
                            }
                        }

                    }
                    break;
            }
        }
        return false;
    }

    function GetData(id, kind) {
        for (var data in window.CData) {
            if (window.CData[data]["CARD_NO"] == ('0000' + id.toString()).substr(-4)) {
                return window.CData[data][kind];
            }
        }
        return '';
    }

    function GetArrToStr(value) {
        var rtnValue = '';
        for (i = 0; i < value.length; i++) {
            if (rtnValue.length > 0)
                rtnValue += '**';
            rtnValue += value[i];
        }
        return rtnValue;
    }

    var vstrCardNo = $.url.param("CardNo");
    if (vstrCardNo.length > 0) {
        $("#txtCardNo").val(vstrCardNo);
        Search();
    }
});