$(document).ready(function() {

  var apiRoot = 'https://fathomless-falls-89522.herokuapp.com/customer/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var customersContainer = $('[data-tasks-container]');

  // init
  getAllCustomers();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-customer-id', data.id);
    element.find('[data-customer-name-section] [data-customer-name-paragraph]').text(data.name);
    element.find('[data-customer-name-section] [data-customer-name-input]').val(data.name);

    element.find('[data-customer-surname-section] [data-customer-surname-paragraph]').text(data.surname);
    element.find('[data-customer-surname-section] [data-customer-surname-input]').val(data.surname);
    
    element.find('[data-customer-email-section] [data-customer-email-paragraph]').text(data.email);
    element.find('[data-customer-email-section] [data-customer-email-input]').val(data.email);
    
    element.find('[data-customer-phoneNumber-section] [data-customer-phoneNumber-paragraph]').text(data.phoneNumber);
    element.find('[data-customer-phoneNumber-section] [data-customer-phoneNumber-input]').val(data.phoneNumber);
    
    element.find('[data-customer-address-section] [data-customer-address-city-paragraph]').text(data.address.city);
    element.find('[data-customer-address-section] [data-customer-address-city-input]').val(data.address.city);
    
    element.find('[data-customer-address-section] [data-customer-address-street-paragraph]').text(data.address.street);
    element.find('[data-customer-address-section] [data-customer-address-street-input]').val(data.address.street);
    
    element.find('[data-customer-address-section] [data-customer-address-homeNumber-paragraph]').text(data.address.homeNumber);
    element.find('[data-customer-address-section] [data-customer-address-homeNumber-input]').val(data.address.homeNumber);
    
    element.find('[data-customer-address-section] [data-customer-address-flatNumber-paragraph]').text(data.address.flatNumber);
    element.find('[data-customer-address-section] [data-customer-address-flatNumber-input]').val(data.address.flatNumber);
    
    element.find('[data-customer-address-section] [data-customer-address-postCode-paragraph]').text(data.address.postCode);
    element.find('[data-customer-address-section] [data-customer-address-postCode-input]').val(data.address.postCode);

    return element;
  }

  function handleDatatableRender(data) {
    customersContainer.empty();
    data.forEach(function(customer) {
      createElement(customer).appendTo(customersContainer);
    });
  }

  function getAllCustomers() {
    var requestUrl = apiRoot + 'getCustomers';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

  function handleTaskUpdateRequest() {
    var parentEl = $(this).parent().parent();
    var taskId = parentEl.attr('data-task-id');
    var taskTitle = parentEl.find('[data-task-name-input]').val();
    var taskContent = parentEl.find('[data-task-content-input]').val();
    var requestUrl = apiRoot + 'updateTask';

    $.ajax({
      url: requestUrl,
      method: "PUT",
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        id: taskId,
        title: taskTitle,
        content: taskContent
      }),
      success: function(data) {
        parentEl.attr('data-task-id', data.id).toggleClass('datatable__row--editing');
        parentEl.find('[data-task-name-paragraph]').text(taskTitle);
        parentEl.find('[data-task-content-paragraph]').text(taskContent);
      }
    });
  }

  function handleTaskDeleteRequest() {
    var parentEl = $(this).parent().parent();
    var taskId = parentEl.attr('data-task-id');
    var requestUrl = apiRoot + 'deleteTask';

    $.ajax({
      url: requestUrl + '/?' + $.param({
        id: taskId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleTaskSubmitRequest(event) {
    event.preventDefault();

    var taskTitle = $(this).find('[name="title"]').val();
    var taskContent = $(this).find('[name="content"]').val();

    var requestUrl = apiRoot + 'createTask';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        title: taskTitle,
        content: taskContent
      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllTasks();
        }
      }
    });
  }

  function toggleEditingState() {
    var parentEl = $(this).parent().parent();
    parentEl.toggleClass('datatable__row--editing');

    var taskTitle = parentEl.find('[data-task-name-paragraph]').text();
    var taskContent = parentEl.find('[data-task-content-paragraph]').text();

    parentEl.find('[data-task-name-input]').val(taskTitle);
    parentEl.find('[data-task-content-input]').val(taskContent);
  }

  $('[data-task-add-form]').on('submit', handleTaskSubmitRequest);

  customersContainer.on('click','[data-task-edit-button]', toggleEditingState);
  customersContainer.on('click','[data-task-edit-abort-button]', toggleEditingState);
  customersContainer.on('click','[data-task-submit-update-button]', handleTaskUpdateRequest);
  customersContainer.on('click','[data-task-delete-button]', handleTaskDeleteRequest);
});
