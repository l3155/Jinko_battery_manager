$(function(){  
  var alarm_page = {
    onInit:function(){
      layui.use(['element','laydate','form'], function(){
        var element = layui.element,
        laydate=layui.laydate,
        form=layui.form;

        laydate.render({
          elem: '#start'
          ,theme: 'molv'
          ,type: 'date'
          ,format: 'yyyy-MM-dd'
        });

        laydate.render({
          elem: '#end'
          ,theme: 'molv'
          ,type: 'date'
          ,format: 'yyyy-MM-dd'
        });
        makeDivHeight("#main",200);
        
        var user_name = $("#user_name").text();
        
        var url="/get_receiver"//+"?user_name="+user_name;
        $.get(url,$.proxy(alarm_page.getReceiver,alarm_page));
        
        var receiver=$("#receiver_sort").val();
        var url="/get_alarm_data"+"?receiver="+"all"//+"&user_name="+user_name;
        $.get(url,$.proxy(alarm_page.getBattery,alarm_page));
        
        form.on('submit(searchBatteryBtn)', function(detailFormData){
          var receiver=$("#receiver_sort").val();
          var user_name="user1";
          var url="/get_alarm_data"+"?receiver="+receiver//+"&user_name="+user_name;
          $.get(url,$.proxy(alarm_page.getBattery,alarm_page));
          return false;
        });
      });
    },   
    getReceiver:function(data){
      layui.use('form', function(){
        var form=layui.form;
        var revs = data.data;
        var addHtml='';
        $.each(revs,function(index,value){
          addHtml+="<option value='"+value.name+"'>"+value.name+"</option>";
        });
        $("#receiver_sort").empty();
        $("#receiver_sort").append(addHtml);            
        form.render();
    });       
    },
    getBattery:function(data){
      layui.use(['element','form','layer'], function(){
        var element = layui.element,
        form=layui.form,
        layer=layui.layer;
        //添加电池
        var recArray = data.data;
        var addHtml="";
        $.each(recArray,function(index,value){
          var receiverName=value.receiver;
          addHtml+="<fieldset class='layui-elem-field site-demo-button'>";
          addHtml+="<legend id='"+receiverName+"'>"+receiverName+"</legend>";
          var batteryArray=value.batteries;
          $.each(batteryArray,function(index,value){
            var batteryImg="";
            if("Normal"===value.status){
              batteryImg="battery_green.svg";
            }else if("Abnormal"===value.status){
              batteryImg="battery_red.svg";
            }else if(""===value.status){
              batteryImg="battery_gray.svg";
            }
            addHtml+="<div class='container-battery'>";
            addHtml+="<div class='container-battery-img'><img id='";
            addHtml+=value.battery;
            addHtml+="' src='../static/image/"+batteryImg+"'/></div>";
            addHtml+="<div class='container-battery-detail'><ul><li>电池:";
            addHtml+=value.battery;
            addHtml+="</li><li>温度:";
            addHtml+=value.temperature;
            addHtml+="</li><li>电压:";
            addHtml+=value.voltage;
            addHtml+="</li><li>状态:";
            addHtml+=value.status;
            addHtml+="</li></ul></div></div>";
          });
          addHtml+="</fieldset>";
        });
        $("#main").empty();
        $("#main").append(addHtml);
        element.render('main');
      //点击弹出chart搜索页面
      $("#tempChart").empty();
      $("#volChart").empty();
      $("img").click(function(){
        var battery=$(this).attr("id");
        var receiver = $(this).parent().parent().parent().find('legend').text();
        layer.open({
          type: 1,
          title: 'Battery Detail',
          closeBtn: 1,
          area: '600px',
          content: $('#chartContainer')
        });
        var url="/battery_details"+"?battery="+battery+"&receiver="+receiver;
        $.get(url,$.proxy(alarm_page.getDetail,alarm_page));
        form.on('submit(searchDetailBtn)', function(data){
          var start;
          var end;

          if (''===data.field.startDatetime) {
            start=getDate(1).Format("yyyy-MM-dd");
            $("#start").attr("value", start);
          }else{
            start=data.field.startDatetime;
          }

          if (''===data.field.endDatetime) {
            end=getDate(0).Format("yyyy-MM-dd");
            $("#end").attr("value", end);
          }else{
            end=data.field.endDatetime;
          }

          if(start!=""&&end!=""&&start >=end){
            layer.alert('起始时间应小于结束时间！请重新选择时间～', {
              title: '提示'
            });return false;
          }else{
          var url="/battery_details"+"?battery="+battery+"&receiver="+receiver+"&start_time="+start+"&end_time="+end;
          //制作折线图
          $.get(url,$.proxy(alarm_page.getDetail,alarm_page));
          return false;
          }
        });
      });
      });
    },
    getDetail:function(data){
      var that=this;
      that.makeChart(data,"tempChart");
      that.makeChart(data,"volChart");
    },
    makeChart:function(myData,cid){
      var id = document.getElementById(cid);
      var myChart = echarts.init(id);
      var titleText="";
      var seriesName="";
      var xData=new Array();
      var yData=new Array();
      if(cid==="tempChart"){
        titleText="温度趋势图";
        seriesName="temperature";
        limitData=[
                {yAxis: myData.temp_limit.upper, name: '最大值'},
                {yAxis: myData.temp_limit.lower, name: '最小值'},
                ];
        $.each(myData.data,function(index,value){
          xData.push(value.time);
          yData.push(value.temperature);
        });
      } else if(cid==="volChart"){
        titleText="电压趋势图";
        seriesName="voltage";
        limitData=[
                {yAxis: myData.vol_limit.upper, name: '最大值'},
                {yAxis: myData.vol_limit.lower, name: '最小值'},
                ];
        $.each(myData.data,function(index,value){
          xData.push(value.time);
          yData.push(value.voltage);
        });
      }
      option = {
        title: {
          text: titleText,
          bottom:'87%',
          left:'2%'
        },
        legend:{
          show:false
        },
        grid: {
          top:'15%',
          right:'3%',
          bottom:'3%',
          left:'3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true
          },
          data:xData
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '20%'],
          splitLine: {
            show: true
          }
        },
        series:[{
          name:seriesName,
          type: 'line',
          smooth:false,
          sampling:'max',
          showSymbol: true,
          hoverAnimation: false,
          label:{
            normal: {
              show: true,
              position: 'top'
            }
          },
          markLine: {
                data: limitData
            },
          lineStyle:{
            normal:{
              color:'green',
            }
          },
          data:yData
        }]
      };
      myChart.setOption(option);
    },
  };
  alarm_page.onInit();
});