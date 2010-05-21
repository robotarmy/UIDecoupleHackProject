var initalize_ledger = function()
{
  $.getJSON('http://localhost:8001/hi.json?callback=?', function(jarray) {  
    var list = ledger_list();
    jarray.forEach(function(json) {
      id = json._id ;
      delete json['_id'];
      $(list).append(create_dom_from(id,json));
    });
  });  
};

var create_dom_from = function(id,object)
{ 
  var node = $("<li>\n</li>\n");
  var prop_node = $("<div class='properties'></div>");
  node.attr('id',"item_"+id);
  node.addClass("item");
  var properties = []
  for(var key in object) {
    property = {};
    property.kind = 'text';
    property.type = key;
    property.value = object[key];

    $(prop_node).append(create_dom_ledger_item(property));
    properties[properties.length] = property;
  }

  $(node).append(prop_node);
  $(node).append(create_dom_ledger_form(properties));
  return node;
};

var create_dom_ledger_form = function(properties)
{
  var node = $("<form class='hide'></form>");    
  properties.forEach(function(property){
    $(node).append(create_dom_ledger_form_input(property));
  });
  return node;
};

var create_dom_ledger_form_input = function(property)
{
  return "<div class='"+property.kind+"'><input class='required "+property.type+"' type='textfield' value='"+property.value+"'></div>"    
};

var create_dom_ledger_item = function(property)
{
  struct = $("<div class='"+property.kind+
             "'>\n<label>"+property.type+"</label><span class='"+property.type+
               "'>\n"+property.value+ "</span>"+
                 "</div>\n");
  struct.hide();
  struct.fadeIn('slow');
  return struct;
};

var ledger_form_to_struct = function(focus)
{
  var name = $('#'+focus.attr('id')+' .name input').val();
  var amount = $('#'+focus.attr('id')+' .amount input').val();
  var properties = [{ kind:'amount',value:amount,type:'dollars'},
    { kind:'name',value:name,type:'text'}];
    return properties;
};

var ledger_list = function()
{
  return $(".list");
};

var ledger_size = function()
{
  return ledger_list().children().size();
};

var update_ledger_from_form = function(focus)
{  
  var item = ledger_form_to_struct(focus);
  $.post('/ledger/update', { id: focus.attr('id'),json: JSON.stringify(item) } , function(json) {
    $('#'+json.id).replace(create_dom_from(json.id,json.properties));
    switch_to_edit_form(focus);
  });
};

var create_ledger_from_form = function(focus)
{
  var id = ledger_size();
  var item = ledger_form_to_struct(focus);
  $.post('/ledger/create', { json: JSON.stringify(item) } , function(id) {
    var item = create_dom_from(id,item);
    $('.ledger .list #create_ledger_form').after(item);
  });
};

var decorate_textfields = function()
{
  var all_textfields = $('input:text');
  if(all_textfields.size() > 0)
    {
      all_textfields.each(function(i, el){
        var parent_css_class = $(el).parent().attr('class');
        if (parent_css_class)
          {
            // css class becomes the text value for a new label element 
            var has_no_label = $(el).siblings('label').size() == 0;
            // Only magically add labels when they aren't already there
            if (has_no_label)
              {
                var new_label = $("<label>"+parent_css_class+"</label>");
                new_label.css('text-transform','capitalize');
                $(el).before(new_label);
              }
          }
      });
    }
};

var downarrow = function()
{
  var current_focus = focused_item();
  if (current_focus.size() == 0)
    {
      current_focus = $('#create_ledger_form'); // first
    }
    var to_focus = current_focus.next();
    if (to_focus.size() == 0) {
      to_focus = current_focus;
    }
    current_focus.removeClass('focused');
    to_focus.addClass('focused');
};

var focused_item = function()
{
  return $('.item.focused');
};

var uparrow = function()
{
  var current_focus = focused_item();
  var to_focus = current_focus.prev();
  if (to_focus.size() == 0) {
    to_focus = current_focus;
  }
  current_focus.removeClass('focused');
  to_focus.addClass('focused');
};

var enter = function()
{ 
  var focus = focused_item();
  if (focus === $('#create_ledger_form')        )
    {       
      if (form_complete(focus)) {
        create_ledger_from_form(focus);
      }
    }
    else if (focus.children('form').is(':visible'))
      {
        update_ledger_from_form(focus);      
      }
      else
        {
          switch_to_edit_form(focus);
        }
};

var switch_to_edit_form = function(focus)
{    
  focus.children('.properties').toggle();
  focus.children('form').toggle();
};

var form_complete = function(form)
{
  var complete = true;
  form.children('input.required').each(function(i,input){
    if ("" == $(input).val()) {
      if (complete) {
        input.focus();
      }
      complete = false;
    }
    else
      {
        complete = true && complete;
      }      
  });
  return complete;
};

// i'n'n'it - init - isn't it
var init_keybindings = function(){
  $(window).keydown(function(event){
    switch (event.keyCode) {
      // ...
      // different keys do different things
      // Different browsers provide different codes
      // see here for details: http://unixpapa.com/js/key.html    
      // ..
      case 13:
        enter();
      break;
      case 38:
        uparrow();
      break;
      case 40:
        downarrow();
      break;
    }
  });

};

$(document).ready(function(){
  init_keybindings();
  decorate_textfields();  
  initalize_ledger();
});

