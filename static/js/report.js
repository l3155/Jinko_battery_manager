$(function(){  
  var report = {
    onInit:function(){
        layui.use(['element','form','table','laydate','jquery'], function(){
          var form = layui.form,
          element = layui.element,
          $ = layui.jquery,
          laydate=layui.laydate,
          table=layui.table;

          laydate.render({
            elem: '#start',
            theme: 'molv',
            type: 'date',
            format: 'yyyy-MM-dd'
          });

          laydate.render({
            elem: '#end',
            theme: 'molv',
            type: 'date',
            format: 'yyyy-MM-dd'
          });
        
        var user_name = $("#user_name").text();
        var url="/get_receiver"//+"?user_name="+user_name;
        $.get(url,$.proxy(report.getReceiver,report));

          //监听提交
        form.on('submit(searchBtn)', function(data){
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
            //var url=BASE_URL+'?receiverId='+data.field.receiver+'&start='+start+'&end='+end;
            var receiver=$("#receiver_sort").val();
            var thisUrl='/get_report'+'?receiver='+receiver+'&start_time='+start+'&end_time='+end;
            var tableHeight=$(document).height()-280+"px";
            table.render({
              elem: '#reportTable',
              height: tableHeight,
              url: thisUrl,
              page: true,
              cols: [[
              {field: 'receiver', title: '接收器编号',sort: true},
              {field: 'battery', title: '电池编号',sort: true},
              {field: 'temperature', title: '温度',sort: true},
              {field: 'voltage', title: '电压',sort:true},
              {field: 'province', title: '省份',sort: true},
              {field: 'time', title: '采集时间',sort: true} 
              ]]
            }); 
          }
          
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
  };
report.onInit();
});

