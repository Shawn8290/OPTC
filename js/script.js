
$(document).ready(function () {
    loadBookData();

    var detailWin = $("#detail-window").kendoWindow({
        width: '100%',
        title: '',
        modal: true,
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
                field: "Icon", title: "圖像", width: "20%"
                , headerAttributes: { style: "white-space: normal" }
                , template: function (dataItem) {
                    return dataItem.Icon;
                }
            },
            {
                field: "Type", title: "屬性", width: "10%"
                , headerAttributes: { style: "white-space: normal" }
                , template: function (dataItem) {
                    return dataItem.Type;
                }
            },
            {
                field: "Class", title: "Type", width: "20%"
                , template: function (dataItem) {
                    return dataItem.Class;
                }
            },
            {
                field: "Stars", title: "★數", width: "10%"
                , headerAttributes: { style: "white-space: normal" }
            },
            { field: "Cost", title: "Cost", width: "10%" },
            {
                field: "Sockets", title: "插槽數", width: "10%"
                , headerAttributes: { style: "white-space: normal" }
            },
            { hidden: true, field: "MAXLV", title: "最大等級", width: "0%" },
            { hidden: true, field: "Status", title: "體力<br>攻擊<br>回復", width: "0%" },
            {
                field: "SkillCD", title: "技能CD", width: "10%"
                , headerAttributes: { style: "white-space: normal" }
                , template: function (dataItem) {
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

    $(".btn-search").click(function (e) {
        e.preventDefault();
        Search();
    });

    $(".btn-clear").click(function (e) {
        e.preventDefault();
        Clear();
    });

    $(".btn-win-close").click(function (e) {
        e.preventDefault();
        detailWin.close();
    });

    var grid = $("#CardGrid").data("kendoGrid");
    $(grid.tbody).on("click", "td", function (e) {
        var row = $(this).closest("tr");;
        var item = grid.dataItem(row);

        var id = ('0000' + item.CardNo).substr(-4);
        detailWin.title("詳細說明 - " + id);
        var ImgName = "https://onepiece-treasurecruise.com/wp-content/uploads/c" + id + ".png";
        $(".card-image").attr("src", ImgName);
        $("#lblMAXLV").text(item.MAXLV);
        $("#lblStatus").text(item.Status);
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
            && (SocketsValue === '')
            && (DropsValue === '')
            && (CardNo.trim() === '')) {
            return;
        }

        $("#CardGrid").data('kendoGrid').dataSource.data([]);

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
                return;
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
        var strID = ('0000' + id).substr(-4);
        return GetIconUrl(strID);
    }

    function GetIconUrl(FileName) {
        var url1 = 'https://onepiece-treasurecruise.com/wp-content/uploads/f' + FileName + '.png';
        var url2 = 'https://onepiece-treasurecruise.com/wp-content/uploads/f0' + FileName + '.png';
        return '<img class="icon" src="' + url1 + '" onerror=\"this.src=\''+ url2 + '\'\">';
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
        return HP + '\\' + ATK + '\\' + CURE;
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
        var rtnValue = false;
        $.each(window.drops, function (type_kind, type) {
            if (type_kind == kind.trim()) {
                $.each(type, function (i, island) {
                    $.each(island, function (stage_kind, stage) {
                        switch (stage_kind) {
                            case 'thumb':
                            case 'name':
                            case 'shortName':
                            case 'day':
                            case 'global':
                            case 'condition':
                            case 'completion':
                            case 'challenge':
                            case 'challengeData':
                            case 'showManual':
                            case 'gamewith':
                            case 'teamDatabase':
                                return;
                            default:
                                if ($.inArray(id, stage) != -1) {
                                    rtnValue = true;
                                    return false;
                                }
                        }
                    });
                    if (rtnValue) return false;
                });
            }
            if (rtnValue) return false;
        });
        return rtnValue;
    }

    function GetData(id, kind) {
        for (var data in cardDataFromLocalStorage) {
            if (cardDataFromLocalStorage[data]["CARD_NO"] == ('0000' + id.toString()).substr(-4)) {
                return cardDataFromLocalStorage[data][kind];
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

    function loadBookData(){
        cardDataFromLocalStorage = JSON.parse(localStorage.getItem("CardData"));
        if(cardDataFromLocalStorage == null){
            cardDataFromLocalStorage = window.CData;
            localStorage.setItem("CardData",JSON.stringify(cardDataFromLocalStorage));
        }
    }

    var vstrCardNo = $.url.param("CardNo");
    if (vstrCardNo.length > 0 && grid.dataSource) {
        $("#txtCardNo").val(vstrCardNo);
        Search();
    }
});