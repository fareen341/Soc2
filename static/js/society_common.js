
$(document).ready(function () {

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;



    setProgressBar(current);

    let stopNext = true
    let memberData = []
    let nomineeData = []
    // MEMBER ON-CHANGE START
    $("#id_wing_flat").change(function (e) {
        // alert("CALLING");
        let formData = new FormData();
        let flatSelectedValue = $(this).val();
        formData.append('flatSelectedValue', flatSelectedValue);
        formData.append('get_ownership_ajax', false);
        formData.append('ajax_get_primary', true);


        let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let headers = {
            "X-CSRFToken": csrfToken
        };


        $.ajax({
            url: '/member-master/',
            method: 'POST',
            data: formData,
            headers: headers,
            processData: false,
            contentType: false,
            success: function (response) {
                // console.log("response ============");
                if (response.is_primary) {
                    $("#id_is_primary").hide();
                } else {
                    $("#id_is_primary").show();
                }
                console.log("Success");
            },
            error: function (xhr) {
                alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
            }
        });
    });
    // MEMBER ON-CHANGE END

    $('#save_and_next_member, #save_and_add_member').click(function (e) {
        alert("call");
        clickedButton = this;
        let isValid = true;
        let ajax_ownsership = false;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const max100NumberRegex = /^(?:[1-9]\d{2,}|1000+)$/;
        let numberregex = /^([1-9]\d{0,1}|100)$/;
        let required_fields = {
            // members ids
            "id_wing_flat": "Pls select the flat number!",
            "id_member_name": "Member name is required!",
            // "id_member_ownership": "Member ownership is required!",
            // "id_member_position": "Member position is required!",
            // "id_member_dob": "Date of birth is required!",
            // "id_member_pan_number": "Member pan number is required!",
            // "id_member_aadhar_no": "Member aadhar number is required!",
            // "id_member_address": "Address is required!",
            // "id_member_state": "State is required!",
            // "id_member_pin_code": "Pin code is required",
            // "id_member_email": "Email is reqired!",
            // "id_member_contact": "Contact number is required!",
            // "id_member_emergency_contact": "Emergency contact no. is required!",
            // "id_member_occupation": "Occupation is required!",
        };

        let get_nominee_detail = {
            // nominee ids
            // "id_nominee_name": "Nominee name is required!",
            // "id_nomination_date": "Date of nomination is required!",
            // "id_nominee_relation": "Nominee relation is required!",
            // "id_naminee_sharein": "Nominee sharein is required!",
            // "id_nominee_dob": "Nominee date of birth is required!",
            // "id_nominee_aadhar_no": "Nominee aadhar no. is required!",
            // "id_nominee_pan_no": "Nominee pan no. is required!",
            // "id_nominee_email": "Nominee email is required!",
            // "id_nominee_address": "Nominee address is required!",
            // "id_nominee_state": "Nominee state is required!",
            // "id_nominee_pin_code": "Nominee pin code is required!",
            // "id_nominee_contact_number": "Nominee contact number is required!",
            // "id_nominee_emergency_contact": "Nominee emergency contact is required!",
        };

        let email_fields = {
            // "id_member_email": "Invalid Email",
            // "id_nominee_email": "Invalid Email"
        }

        for (let key in get_nominee_detail) {
            Array.from(document.querySelectorAll('[id^="' + key + '"]'))
                .filter(element => !element.id.includes('_Error'))
                .map(element => {
                    required_fields[element.id] = get_nominee_detail[key]; // Use the corresponding message from get_nominee_detail
                    return element;
                });
        }

        function validateForm(step) {
            for (let key in required_fields) {
                let inputValue = $("#" + key).val();
                let value = (inputValue !== null && inputValue !== undefined) ? inputValue.trim() : "";

                if ((value === "") || (
                    (key.startsWith("id_nominee_state")) && (value == "#") ||
                    (key == "id_wing_flat") && (value == "#") ||
                    (key == "id_member_position") && (value == "#") ||
                    (key == "id_member_state") && (value == "#")
                )) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else if (value && ((key === "id_member_email") && !emailRegex.test(value) || (key.startsWith("id_nominee_email")) && !emailRegex.test(value))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Invalid Email!");
                } else if (value && ((key === "id_member_ownership") && !numberregex.test(value))) {
                    // console.log("NUMBER===============")
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Percentage shoule be below 100");
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }

            for (let key in email_fields) {
                let value = $("#" + key).val().trim();
                if (value && (!emailRegex.test(value))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Invalid Email");
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }

            // let validate_ownership = [{"member_ownership": $('#id_member_ownership').val(), "wing_flat_number": $('#id_wing_flat').val()}]
            let formData = new FormData();
            formData.append('get_ownership_ajax', true);
            formData.append('ajax_get_primary', false);
            formData.append('member_ownership', $('#id_member_ownership').val());
            formData.append('wing_flat_number', $('#id_wing_flat').val());

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: '/member-master/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                async: false,
                success: function (response) {
                    console.log("Success=======Success");
                    if (response.ownership) {
                        $("#id_member_ownership").css("border-color", "red");
                        $("#id_member_ownership_Error").text(response.ownership);
                        ajax_ownsership = true;
                        isValid = false;
                        console.log("in if=====================in if")
                    } else {
                        $("#id_member_ownership").css("border-color", "");
                        $("#id_member_ownership_Error").text("");
                        console.log("in else=====================in else")

                        // tryna fix it might create problem later
                        // stopNext = false
                    }
                },
                error: function (xhr) {
                    console.log("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });

            return isValid;
        }


        // if (ajax_ownsership){}
        if (!validateForm(1)) {
            console.log("INVALID========================");
            console.log("ajax_ownsership=========", ajax_ownsership)
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            console.log("VALID========================")
            stopNext = true;
            const nominee_form_count = Array.from(document.querySelectorAll('[id^="id_nominee_name"]'))
                .filter(element => !element.id.endsWith('_Error')).length;

            for (var i = 0; i < nominee_form_count + 1; i++) {
                let count = i
                if (count === 0) {
                    count = "";
                }
                console.log("number is===========", count)
                nomineeData.push({
                    ["nominee_name"]: $('#id_nominee_name' + count).val(),
                    ["date_of_nomination"]: $('#id_nomination_date' + count).val() === "" ? null : $('#id_nomination_date' + count).val(),
                    ["relation_with_nominee"]: $('#id_nominee_relation' + count).val(),
                    ["nominee_sharein_percent"]: $('#id_naminee_sharein' + count).val() === "" ? 0 : $('#id_naminee_sharein' + count).val(),
                    ["nominee_dob"]: $('#id_nominee_dob' + count).val() === "" ? null : $('#id_nominee_dob' + count).val(),
                    ["nominee_aadhar_no"]: $('#id_nominee_aadhar_no' + count).val(),
                    ["nominee_pan_no"]: $('#id_nominee_pan_no' + count).val(),
                    ["nominee_email"]: $('#id_nominee_email' + count).val(),
                    ["nominee_address"]: $('#id_nominee_address' + count).val(),
                    ["nominee_state"]: $('#id_nominee_state' + count).val(),
                    ["nominee_pin_code"]: $('#id_nominee_pin_code' + count).val(),
                    ["nominee_contact"]: $('#id_nominee_contact_number' + count).val(),
                    ["nominee_emergency_contact"]: $('#id_nominee_emergency_contact' + count).val(),
                });
            }
            memberData.push({
                ["member_name"]: $('#id_member_name').val(),
                ["ownership_percent"]: $('#id_member_ownership').val(),
                ["member_position"]: $('#id_member_position').val(),
                ["member_dob"]: $('#id_member_dob').val() === "" ? null : $('#id_member_dob').val(),
                ["member_pan_no"]: $('#id_member_pan_number').val(),
                ["member_aadhar_no"]: $('#id_member_aadhar_no').val(),
                ["member_address"]: $('#id_member_address').val(),
                ["member_state"]: $('#id_member_state').val(),
                ["member_pin_code"]: $('#id_member_pin_code').val(),
                ["member_email"]: $('#id_member_email').val(),
                ["member_contact"]: $('#id_member_contact').val(),
                ["member_emergency_contact"]: $('#id_member_emergency_contact').val(),
                ["member_occupation"]: $('#id_member_occupation').val(),
                ["member_is_primary"]: $('#id_is_primary_val').prop('checked')

            });

            let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            let headers = {
                "X-CSRFToken": csrfToken
            };
            let formData = new FormData();
            let memberDataJson = JSON.stringify(memberData);
            let nomineeDataJson = JSON.stringify(nomineeData);
            formData.append('form_name', 'member_form_creation');
            formData.append('memberData', memberDataJson);
            formData.append('nomineeData', nomineeDataJson);
            formData.append('member_ownership', $('#id_member_ownership').val());
            formData.append('wing_flat_number', $('#id_wing_flat').val());


            $.ajax({
                url: '/member-master-creation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    toastr.success(response.message, "Member Details Added!");
                    // $("#msform")[0].reset();
                    if ($(clickedButton).is('#save_and_add_member')) {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    }

                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $("#addSharesDetail").click(function (e) {
        // alert("CALLING");
        let required_fields = {
            "id_shared_wing_flat_select": "Pls select the flat number!",
            "id_folio_number": "Folio number is required!",
            // "id_shares_date": "Shares date is required",
            // "id_application_number": "Application number is required!",
            // "id_shares_certificate": "Shares certificate is reqired!",
            // "id_allotment_number": "Allotment number is required!",
            // "id_shares_from": "Shares from date is required!",
            // "id_shares_to": "Shares to date is required!",
            // "id_shares_transfer_date": "Shares trasfer date is required!",
            // "id_total_amount_received": "Total amount received is required!",
            // "id_total_amount_date": "Amount received date is required!",
            // "id_transfer_from_folio_no": "Transfer from folio number is reqired!",
            // "id_transfer_to_folio_no": "Transfer to folio number is required!"
        };

        let isValid = true
        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "" || ((key == "id_shared_wing_flat_select") && (value == "#"))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }
            return isValid;
        }

        if (!validateForm()) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            stopNext = true;
            let sharedData = {};
            const shares_form_fields = [
                "folio_number", "shares_date", "application_number",
                "shares_certificate", "allotment_number", "shares_from", "shares_to", "shares_transfer_date",
                "total_amount_received", "total_amount_date", "transfer_from_folio_no", "transfer_to_folio_no",
            ];

            shares_form_fields.forEach(function (field) {
                // Use the actual field name from the Django model
                let modelFieldName = field;

                if (field === "shares_date" || field === "shares_transfer_date" || field === "total_amount_date") {
                    sharedData[modelFieldName] = $('#id_' + field).val() === "" ? null : $('#id_' + field).val();
                } else if (field === "total_amount_received") {
                    sharedData[modelFieldName] = $('#id_' + field).val() === "" ? 0 : $('#id_' + field).val();
                } else {
                    sharedData[modelFieldName] = $('#id_' + field).val();
                }
            });

            let jsonSharedData = JSON.stringify(sharedData);
            var formData = new FormData();
            formData.append('form_name', "shared_form");
            formData.append('shares_json', jsonSharedData);
            formData.append('id_shared_wing_flat_select', $('#id_shared_wing_flat_select').val());

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: "/member-master-creation/",
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    toastr.success(response.message, "Shares Details Added!");
                    // $("#Societyform")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $("#homeLoanSubmit").click(function (e) {
        let required_fields = {
            "id_home_loan_flat_select": "Pls select flat no.",
            // "id_bank_loan_name": "Bank name is required!",
            // "id_bank_loan_object": "Object of loan is required!",
            // "id_bank_loan_date": "Loan issue date is required!",
            // "id_bank_loan_value": "Loan value is required!",
            // "id_bank_loan_acc_no": "Loan account no. is required!",
            // "id_bank_loan_installment": "Loan installment is required!",
            // "id_bank_loan_status": "Loan status is required",
            // "id_bank_loan_remark": "Loan remark is reqired!"
        }
        let isValid = true
        let fileStatusCheck = true
        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "" || ((key == "id_bank_loan_status") && (value == "#")) || ((key == "id_home_loan_flat_select") && (value == "#"))) {
                    // if ($("#id_bank_loan_status").length > 0 && $("#id_bank_loan_status").val() === "Closed" && isValid == true) {
                    //     // fileStatusCheck = true
                    //     continue
                    // }
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);

                } else {
                    $("#" + key).css("border-color", "");
                    $("#" + key + "_Error").text("");
                }
            }
            if ($("#id_bank_loan_status").length > 0 && $("#id_bank_loan_status").val() === "Active") {
                if ($("#id_bank_loan_noc_file").val() === "") {
                    isValid = false
                    $("#id_bank_loan_noc_file").css("border-color", "red");
                    $("#id_bank_loan_noc_file_Error").text("File needed");
                } else {
                    $("#id_bank_loan_noc_file").css("border-color", "");
                    $("#id_bank_loan_noc_file_Error").text("");
                }
            } else if ($("#id_bank_loan_status").length > 0 && ($("#id_bank_loan_status").val() === "Closed")) {
                isValid = true
                $("#id_bank_loan_noc_file").css("border-color", "");
                $("#id_bank_loan_noc_file_Error").text("");
            }
            return isValid;
        }

        if (!validateForm()) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            const homeLoanData = {};
            console.log("ELSE=================")
            const homeLoanFormFields = [
                "bank_loan_name", "bank_loan_object", "bank_loan_date", "bank_loan_value",
                "bank_loan_acc_no", "bank_loan_installment", "bank_loan_status", "bank_loan_remark"
            ];

            homeLoanFormFields.forEach(function (field) {
                if (field === "bank_loan_date") {
                    homeLoanData[field] = $('#id_' + field).val() === "" ? null : $('#id_' + field).val();
                } else if (field === "bank_loan_status") {
                    homeLoanData[field] = $("#id_" + field).prop("checked")
                } else {
                    homeLoanData[field] = $('#id_' + field).val();
                }
            });

            const homeLoanDataJson = JSON.stringify(homeLoanData);
            var formData = new FormData();
            formData.append('form_name', "home_loan_form");
            formData.append('wing_flat', $('#id_home_loan_flat_select').val());
            formData.append('home_loan_json', homeLoanDataJson);
            if ($('#id_bank_loan_noc_file')[0].files.length > 0) {
                formData.append('id_bank_loan_noc_file', $('#id_bank_loan_noc_file')[0].files[0]);
            }

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: "/member-master-creation/",
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success")
                    // if (response.reg_number) {
                    //     $("#unique_reg_number").val(response.reg_number)
                    //     // alert(response.reg_number)
                    // }
                    toastr.success(response.message, "Shares Details Added!");
                    // $("#Societyform")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
            stopNext = true
        }
    });

    $("#gstFormSubmit").click(function (e) {
        // alert("call");
        let isValid = true;
        let required_fields = {
            "id_gst_flat_select": "Pls select flat",
            // "id_gst_number": "Gst number required!",
            // "id_gst_state": "GST state required!",
            // "id_gst_billing_name": "Billing name is required!",
            // "id_gst_billing_address": "Billing address is required!",
            // "id_gst_contact_no": "Contact number is required!"
        }

        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "" || ((key == "id_gst_state") && (value == "#"))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }
            return isValid;
        }

        if (!validateForm()) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            const GSTData = {};
            const GSTFormFields = [
                "gst_number", "gst_state", "gst_billing_name", "gst_billing_address",
                "gst_contact_no",
            ];

            GSTFormFields.forEach(function (field) {
                GSTData[field] = $('#id_' + field).val();
            });

            const GSTDataJson = JSON.stringify(GSTData);
            var formData = new FormData();
            formData.append('form_name', "gst_form");
            formData.append('wing_flat', $('#id_gst_flat_select').val());
            formData.append('gst_json', GSTDataJson);

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: "/member-master-creation/",
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success")
                    // if (response.reg_number) {
                    //     $("#unique_reg_number").val(response.reg_number)
                    //     // alert(response.reg_number)
                    // }
                    toastr.success(response.message, "Shares Details Added!");
                    // $("#Societyform")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
            stopNext = true
        }

    });


    $("#vehicleFormSubmit").click(function (e) {
        // get all the values here
        let isValid = true;
        let required_fields = {};
        let vehicleData = [];
        getAllVehicleDetails = {
            "id_parking_lot": "Parking log is reqired!",
            // "id_vehicle_type": "Vehicle type is required!",
            // "id_vehicle_number": "Vehicle number is required!",
            // "id_vehicle_brand": "Vehicle brand is required!",
            // "id_rc_copy": "Vehicle cpy is required!",
            // "id_sticker_number": "Sticker number is required!",
            // "id_select_charge": "Vehiche chargable or not, pls select one!",
            // "new_vehicle_id_select_charge": "Charge amount is reqired!",
        }

        for (let key in getAllVehicleDetails) {
            Array.from(document.querySelectorAll('[id^="' + key + '"]'))
                .filter(element => !element.id.includes('_Error'))
                .map(element => {
                    required_fields[element.id] = getAllVehicleDetails[key]; // Use the corresponding message from get_nominee_detail
                    return element;
                });
        }

        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "" || (key.startsWith("id_select_charge") && (value == "#"))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#Error_" + key).text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#Error_" + key).text(""); // Clear the error message
                }
            }
            return isValid;
        }

        // console.log("REQ fields===", required_fields)

        if (!validateForm()) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
            console.log("failed")
        } else {
            console.log("success")
            const vehicleCount = Array.from(document.querySelectorAll('[id^="id_vehicle_number"]'))
                .filter(element => !element.id.endsWith('_Error')).length;

            // let file = $('#id_rc_copy0')[0].files[0];
            let formData = new FormData();
            for (var i = 0; i < vehicleCount; i++) {
                vehicleData.push({
                    ["parking_lot"]: $('#id_parking_lot' + i).val(),
                    ["vehicle_type"]: $('#id_vehicle_type' + i).val(),
                    ["vehicle_number"]: $('#id_vehicle_number' + i).val(),
                    ["vehicle_brand"]: $('#id_vehicle_brand' + i).val(),
                    // ["rc_copy"]: $('#id_rc_copy' + i)[0].files[0],
                    ["sticker_number"]: $('#id_sticker_number' + i).val(),
                    ["select_charge"]: $('#id_select_charge' + i).val(),
                    ["new_vehicle_id_select_charge"]: $('#new_vehicle_id_select_charge' + i).val(),
                });
                formData.append('file' + i, $('#id_rc_copy' + i)[0].files[0]);
            }

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            let vehicleDataJson = JSON.stringify(vehicleData);
            formData.append('form_name', "vehicle_form");
            formData.append('wing_flat', $('#id_vehicle_flat_select').val());
            formData.append('vehicleDataJson', vehicleDataJson);
            // formData.append('file', file);

            $.ajax({
                url: '/member-master-creation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    toastr.success(response.message, "Member Details Added!");
                    // $("#bankForm")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });

            console.log("DATA================", vehicleData)
            stopNext = true
        }

    });

    // Society form validation
    $("#SocSubmit").click(function (e) {
        // e.preventDefault()
        /*
            Note: For dependent fields, if we give those dependents fields below then remove the
            validateFields function call from below
            1. Required: If the field is required  the add it in required field.
            2. Email: If the email is not required but need email validation, add it in email_validation key, and remove from required_fields necessary.
            3. Dependent: if the dependent field is required, add both dependent fields in required_fields and remove the function call of validateFields
            but if it is not required removed it from required_fields and give function call.
        */

        let isValid = true;
        let required_fields = {
            "id_society_name": "Name cannot be empty",
            "id_admin_email": "Email cannnot be empty",
            // "id_alternate_email": "Alternate email cannot be empty",
            "id_registration_number": "Reg. No. cannot be empty!",
            "id_registration_doc": "Doc cannot be empty",
            // "id_admin_mobile_number": "Mobile Number cannot be empty!",
            // "id_pan_number": "Pan No. cannot be empty",
            // "id_pan_number_doc": "Pan doc cannot be empty",
            // "id_gst_number": "Gst Number is required",
            // "id_gst_number_doc": "Gst doc be empty",
            // "id_interest": "Interest cannot be empty",
            // "id_society_reg_address": "Society reg. address required!",
            // "id_society_city": "City is required!",
            // "id_socity_state": "State cannot be empty!",
            // "id_alternate_mobile_number": "Alternate mobile number required!",
            // "id_pin_code": "Pin code is required!",
            // "id_society_corr_reg_address": "Corr. Add. is required!",
            // "id_society_corr_city": "society_corr_city required",
            // "id_socity_corr_state": "socity_corr_state is required!",
            // "id_pin_corr_code": "pin_corr_code is required"
        };

        // only give non required email field, and if required give it in required_fields fields
        let email_fields = {
            // "id_admin_email": "Invalid Email",
            "id_alternate_email": "Invalid Email"
        }
        let exact_ten_number = /^\d{10}$/;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function validateForm(step) {
            // let val_val = $("#id_socity_state");
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if ((value === "") ||
                    ((key == "id_socity_state") && (value == "#")) ||
                    ((key == "id_society_city") && (value === "#")) ||
                    ((key == "id_socity_corr_state") && (value === "#")) ||
                    ((key == "id_society_corr_city") && (value === "#"))
                ) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);

                } else if (value && (key === "id_registration_number" || key === "id_pan_number" || key === "id_gst_number") && !exact_ten_number.test(value)) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Number should be exactly 10!");
                } else if (value && ((key === "id_admin_email") || (key === "id_alternate_email")) && !emailRegex.test(value)) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Invalid Email!");
                }
                // else if (key == "id_socity_state"){

                // }
                else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }

            // for unrequired fields EMAIL validation only
            for (let key in email_fields) {
                let value = $("#" + key).val().trim();
                if (value && (!emailRegex.test(value))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Invalid Email");
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }


            // Validation for Registration number
            // validateFields(
            //     $("#id_registration_number").val(),
            //     $("#id_registration_doc").val(),
            //     "#id_registration_number",
            //     "#id_registration_doc",
            //     "Reg No. is required when Reg file is given!",
            //     "Reg. file is required when Reg. No. is given!",
            // );

            // // Validation for GST number
            // validateFields(
            //     $("#id_gst_number").val(),
            //     $("#id_gst_doc").val(),
            //     "#id_gst_number",
            //     "#id_gst_doc",
            //     "GST No. is required when GST file is given!",
            //     "GST file is required when GST No. is given!",
            // );

            // // Validation for PAN Number
            // validateFields(
            //     $("#id_pan").val(),
            //     $("#id_pan_doc").val(),
            //     "#id_pan",
            //     "#id_pan_doc",
            //     "PAN No. is required when PAN file is given!",
            //     "PAN file is required when PAN No. is given!",
            // );

            function validateFields(value, doc, valueElement, docElement, valueErrorMessage, docErrorMessage) {
                // const regex = /^\d{10}$/;
                if (value !== "" && doc === "") {
                    isValid = false;
                    $(docElement).css("border-color", "red");
                    $(docElement + "_Error").text(docErrorMessage);
                } else if (value === "" && doc !== "") {
                    isValid = false;
                    $(valueElement).css("border-color", "red");
                    $(valueElement + "_Error").text(valueErrorMessage);
                }
                else if (value !== "" && (!exact_ten_number.test($(valueElement).val()))) {
                    isValid = false;
                    console.log('Validation failed!', valueElement);
                    $(valueElement).css("border-color", "red");
                    $(valueElement + "_Error").text("Number should be exacly 10");
                    $(docElement).css("border-color", "");
                    $(docElement + "_Error, " + docElement + "_Error").text("");
                    return false;
                }
                else {
                    $(valueElement + ", " + docElement).css("border-color", "");
                    $(valueElement + "_Error, " + docElement + "_Error").text("");  // Use _Error for both elements
                }
            }
            return isValid;
        }

        // if (false) {
        if (!validateForm(1)) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            let reg_name = $("#unique_reg_number").val()
            stopNext = true
            let form_fields = [
                'society_name', 'admin_email', 'alternate_email', 'admin_mobile_number',
                'alternate_mobile_number', 'registration_number', 'registration_doc', 'pan_number', 'pan_number_doc',
                'gst_number', 'gst_number_doc', 'interest', 'society_reg_address', 'society_city',
                'socity_state', 'pin_code', 'society_corr_reg_address', 'society_corr_city', 'socity_corr_state',
                'pin_corr_code'
            ]
            let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            var headers = {
                "X-CSRFToken": csrfToken
            };

            let ajaxUrl = $("#ajax-url").data("url");
            console.log("ajaxUrl========================", ajaxUrl);

            var formData = new FormData();
            form_fields.forEach(function (field) {
                if ($('#id_' + field).prop('type') === 'file') {
                    formData.append(field, $('#id_' + field)[0].files[0]);
                } else {
                    formData.append(field, $('#id_' + field).val());
                }
            });
            formData.append('unique_reg_number', reg_name);
            formData.append('form_name', 'Societyform');


            $.ajax({
                url: ajaxUrl,
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success")
                    if (response.reg_number) {
                        $("#unique_reg_number").val(response.reg_number)
                        // alert(response.reg_number)
                    }
                    toastr.success(response.message, "Society Details Added!");
                    $("#Societyform")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    // Bank form valdation
    $('#bankSubmitAddAnother, #bankSubmit').click(function (e) {

        let isValid = true;
        let required_fields = {}
        let checkedPassed = false;
        let bankData = [];
        getAllBankDetails = {
            // 'id_beneficiary_name': "Beneficiary name cannot be empty!",
            // 'id_beneficiary_code': "Beneficiary code cannot be empty!",
            // 'id_beneficiary_acc_number': "Beneficiary account no. cannot be empty!",
            // 'id_beneficiary_bank': "Beneficiary bank cannot be empty!",
            // 'id_isPrimary': "Pls select to make this primary!"
        }

        for (let key in getAllBankDetails) {
            Array.from(document.querySelectorAll('[id^="' + key + '"]'))
                .filter(element => !element.id.includes('_Error'))
                .map(element => {
                    required_fields[element.id] = getAllBankDetails[key]; // Use the corresponding message from get_nominee_detail
                    return element;
                });
        }

        let getCheckBoxValue = Array.from(document.querySelectorAll('[id^="id_isPrimary"]'))
            .filter(element => !element.id.includes('_Error'))
            .map(element => {
                return element.checked;
            });

        if (getCheckBoxValue.some(value => value === true)) {
            // console.log('At least one checkbox is checked.');
            checkedPassed = true;
        }

        let trueCount = getCheckBoxValue.filter(item => item === true).length > 1;
        console.log("TRUE====================", trueCount)


        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "") {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else if ($("#" + key).is(":checkbox") && !checkedPassed) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else if (trueCount && $("#" + key).prop('checked')) {
                    isValid = false;
                    console.log("CONDN FAILED")
                    $("#" + key + "_Error").text("Select any one of them to make primary!");
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }
            return isValid;
        }

        // console.log("REQ fields===", required_fields)

        if (!validateForm()) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
            console.log("failed")
        } else {
            console.log("success")
            // let reg_name = $("#unique_reg_number").val()
            stopNext = true
            const bank_form_count = Array.from(document.querySelectorAll('[id^="id_beneficiary_name"]'))
                .filter(element => !element.id.endsWith('_Error')).length;

            for (var i = 1; i < bank_form_count + 1; i++) {
                console.log("number is===========", i)
                bankData.push({
                    ["beneficiary_name"]: $('#id_beneficiary_name' + i).val(),
                    ["beneficiary_code"]: $('#id_beneficiary_code' + i).val(),
                    ["beneficiary_acc_number"]: $('#id_beneficiary_acc_number' + i).val(),
                    ["beneficiary_bank"]: $('#id_beneficiary_bank' + i).val(),
                    ["is_primary"]: $("#id_isPrimary" + i).prop("checked")
                });
            }
            let reg_name = $("#unique_reg_number").val()
            console.log("REG NO====================================", reg_name)
            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };
            let formData = new FormData();
            let bankDataJson = JSON.stringify(bankData);
            formData.append('form_name', "bankForm");
            formData.append('unique_reg_number', reg_name);
            formData.append('bankDataJson', bankDataJson);

            console.log("DATA+============", bankData)
            $.ajax({
                url: '/society-creation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    toastr.success(response.message, "Member Details Added!");
                    // $("#bankForm")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $('#SocietyDocumentForm').click(function (e) {
        let valueDocPairArray = []
        let documentKeyArray = []
        let required_fields = {
            // "id_completion_cert": "Completion Cert. is required!",
            // "id_occupancy_cert": "Occupancy Cert. is required!",
            // "id_deed_of_conveyance": "Deed of conveyance is required!",
            // "id_society_by_law": "Society by law is required!",
        };

        let isValid = true
        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val().trim();
                if (value === "") {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }
            return isValid;
        }

        let unit = document.querySelectorAll('[id^="attachDoc"]');
        let wing = document.querySelectorAll('[id^="DocFieldAttach"]');
        let unit_ids = Array.from(unit)
            .filter(element => !element.id.includes('_Error'))
            .map(element => element.id);

        let wing_ids = Array.from(wing)
            .filter(element => !element.id.includes('_Error'))
            .map(element => element.id);

        function zip(arrays) {
            return arrays[0].map(function (_, i) {
                return arrays.map(function (array) {
                    return array[i];
                });
            });
        }
        let zipped = zip([unit_ids, wing_ids]);

        for (let i = 0; i < zipped.length; i++) {
            var wingValue = zipped[i][0];
            var unitValue = zipped[i][1];
            validateFields(
                $('#' + unitValue).val(),
                $('#' + wingValue).val(),
                '#' + unitValue,
                '#' + wingValue,
                "Document specification is required!",
                "Document is required!",
                true
            );
        }

        validateFields(
            $('#id_soc_other_document').val(),
            $('#id_soc_other_document_spec').val(),
            '#id_soc_other_document',
            '#id_soc_other_document_spec',
            "Document is required!",
            "Document specification is required!",
            false
        );

        function validateFields(value, doc, valueElement, docElement, valueErrorMessage, docErrorMessage, flag) {
            if (flag && (value === "" && doc === "")) {
                isValid = false;
                $(docElement).css("border-color", "red");
                $(valueElement).css("border-color", "red");
                $(docElement + "_Error").text(docErrorMessage);
                $(valueElement + "_Error").text(valueErrorMessage);
            } else if (value !== "" && doc === "") {
                isValid = false;
                $(docElement).css("border-color", "red");
                $(docElement + "_Error").text(docErrorMessage);
                $(valueElement).css("border-color", "");
                $(valueElement + "_Error").text("");
            } else if (doc !== "" && value === "") {
                isValid = false;
                $(valueElement).css("border-color", "red");
                $(valueElement + "_Error").text(valueErrorMessage);
                $(docElement).css("border-color", "");
                $(docElement + "_Error").text("");
            } else {
                if (flag) {
                    documentKeyArray.push(value);
                    valueDocPairArray[value] = $(docElement)[0].files[0];
                }
                $(valueElement + ", " + docElement).css("border-color", "");
                $(valueElement + "_Error, " + docElement + "_Error").text("");
            }
            return isValid;
        }

        if ((!validateForm()) && (!validateFields())) {
            toastr.error("Please correct all error to proceed!!");
            stopNext = false
        } else {
            let reg_name = $("#unique_reg_number").val()
            stopNext = true
            let form_fields = [
                'completion_cert', 'occupancy_cert', 'deed_of_conveyance', 'society_by_law', 'soc_other_document', 'soc_other_document_spec'
            ]
            let ajaxUrl = $("#ajax-url").data("url");
            let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            var headers = {
                "X-CSRFToken": csrfToken
            };

            var jsonData = JSON.stringify(documentKeyArray);
            console.log("JSON============", jsonData)

            var formData = new FormData();
            form_fields.forEach(function (field) {
                if ($('#id_' + field).prop('type') === 'file') {
                    formData.append(field, $('#id_' + field)[0].files[0]);
                } else {
                    formData.append(field, $('#id_' + field).val());
                }
            });

            for (var key in valueDocPairArray) {
                if (valueDocPairArray.hasOwnProperty(key)) {
                    formData.append(key, valueDocPairArray[key]);
                }
            }

            formData.append('form_name', 'documentForm');
            formData.append('unique_reg_number', reg_name);
            formData.append('jsonData', jsonData);


            $.ajax({
                url: ajaxUrl,
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success")
                    if (response.reg_number) {
                        // alert(response.status);
                        $("#unique_reg_number").val(response.reg_number)
                    }
                    toastr.success(response.message, "Society Documents Added!");
                    $("#socDocumentForm")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $('#wingSubmit').click(function (e) {
        let isValid = true;
        let unitWingPairArray = []
        let validateFlatNumber = /^(\d+,)*\d+$/;
        let wing = document.querySelectorAll('[id^="wingName"]');
        let unit = document.querySelectorAll('[id^="unitName"]');
        let unit_ids = Array.from(unit)
            .filter(element => !element.id.includes('_Error'))
            .map(element => element.id);

        let wing_ids = Array.from(wing)
            .filter(element => !element.id.includes('_Error'))
            .map(element => element.id);

        function zip(arrays) {
            return arrays[0].map(function (_, i) {
                return arrays.map(function (array) {
                    return array[i];
                });
            });
        }

        let zipped = zip([unit_ids, wing_ids]);

        for (var i = 0; i < zipped.length; i++) {
            var wingValue = zipped[i][0];
            var unitValue = zipped[i][1];
            validateFields(
                $('#' + wingValue).val(),
                $('#' + unitValue).val(),
                '#' + wingValue,
                '#' + unitValue,
                "Flat Numbers are required!",
                "Wing name is required!"
            );
        }

        // function validateFields(newKey, newValue, newKeyElement, newValueElement, newKeyErrorMessage, newValueErrorMessage) {
        //     finalDoc = 44;
        //     console.log("newKey=======" , newKey !== "")
        //     console.log("newValue=======" , newValue !== "")
        //     if (newKey === "" && newValue === "") {
        //         console.log("1=============")
        //         isValid = false;
        //         $(newValueElement).css("border-color", "red");
        //         $(newValueElement + "_Error").text(newValueErrorMessage);
        //         $(newKeyElement).css("border-color", "red");
        //         $(newKeyElement + "_Error").text(newKeyErrorMessage);
        //     } else if ((newKey !== "" && newValue === "") && !validateFlatNumber.test(newKey)) {
        //         console.log("2===================")
        //         isValid = false;
        //         $(newValueElement).css("border-color", "red");
        //         $(newValueElement + "_Error").text(newValueErrorMessage);
        //         $(newKeyElement).css("border-color", "red");
        //         $(newKeyElement + "_Error").text("invalid flat number");
        //     } else if ((newKey !== "" && newValue !== "") && (newKey !== "" && !validateFlatNumber.test(newKey))) {
        //         let x = newKey !== "" && newValue !== "" 
        //         let y = newKey !== "" && !validateFlatNumber.test(newKey)
        //         console.log("abc===================", x)
        //         console.log("abc===================", y)
        //         console.log("3==========================")
        //         isValid = false;
        //         $(newValueElement).css("border-color", "");
        //         $(newValueElement + "_Error").text("");
        //         $(newKeyElement).css("border-color", "red");
        //         $(newKeyElement + "_Error").text("invalid flat number");
        //     } else if (newKey !== "" && newValue === "") {
        //         console.log("4========================")
        //         isValid = false;
        //         $(newValueElement).css("border-color", "red");
        //         $(newValueElement + "_Error").text(newValueErrorMessage);
        //         $(newKeyElement).css("border-color", "");
        //         $(newKeyElement + "_Error").text("");
        //     } else if (newKey === "" && newValue !== "") {
        //         console.log("5============================")
        //         isValid = false;
        //         $(newKeyElement).css("border-color", "red");
        //         $(newKeyElement + "_Error").text(newKeyErrorMessage);
        //         $(newValueElement).css("border-color", "");
        //         $(newValueElement + "_Error").text("");
        //     } else {
        //         console.log("6======================")
        //         unitWingPairArray.push({ "wing": newValue, "flat": newKey })
        //         $(newKeyElement + ", " + newValueElement).css("border-color", "");
        //         $(newKeyElement + "_Error, " + newValueElement + "_Error").text("");
        //     }
        //     return isValid;
        // }

        function validateFields(newKey, newValue, newKeyElement, newValueElement, newKeyErrorMessage, newValueErrorMessage) {
            finalDoc = 44;
            if (newKey === "" && newValue === "") {
                isValid = false;
                $(newValueElement).css("border-color", "red");
                $(newValueElement + "_Error").text(newValueErrorMessage);
                $(newKeyElement).css("border-color", "red");
                $(newKeyElement + "_Error").text(newKeyErrorMessage);
            } else if (newKey !== "" && newValue === "") {
                isValid = false;
                $(newValueElement).css("border-color", "red");
                $(newValueElement + "_Error").text(newValueErrorMessage);
                $(newKeyElement).css("border-color", "");
                $(newKeyElement + "_Error").text("");
            } else if (newKey === "" && newValue !== "") {
                isValid = false;
                $(newKeyElement).css("border-color", "red");
                $(newKeyElement + "_Error").text(newKeyErrorMessage);
                $(newValueElement).css("border-color", "");
                $(newValueElement + "_Error").text("");
            } else {
                unitWingPairArray.push({ "wing": newValue, "flat": newKey })
                $(newKeyElement + ", " + newValueElement).css("border-color", "");
                $(newKeyElement + "_Error, " + newValueElement + "_Error").text("");
            }
            return isValid;
        }

        if (!validateFields()) {
            stopNext = false
        } else {
            let reg_name = $("#unique_reg_number").val()
            stopNext = true
            console.log("unitWingPairArray", unitWingPairArray)
            let ajaxUrl = $("#ajax-url").data("url");
            let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            var headers = {
                "X-CSRFToken": csrfToken
            };
            var formData = new FormData();
            let unitWingJson = JSON.stringify(unitWingPairArray);
            // form_fields.forEach(function (field) {
            //     formData.append(field, $('#id_' + field).val());
            // });
            formData.append('form_name', 'wingUnit');
            formData.append('unique_reg_number', reg_name);
            formData.append('unitWingJson', unitWingJson);

            $.ajax({
                url: ajaxUrl,
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success")
                    if (response.reg_number) {
                        // alert(response.status);
                        $("#unique_reg_number").val(response.reg_number)
                    }
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Society Details Has Been Added!",
                        showConfirmButton: false,
                        timer: 1600
                    }).then(function () {
                        // Redirect after the Swal timer expires
                        window.location.href = '/society-details-view/';
                    });
                    // $("#bankForm")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $(".next").click(function (e) {
        if (stopNext == false) {
            e.preventDefault();
            return;
        }
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(++current);
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%")
    }
});



$(document).ready(function () {
    // GET OWNER NAME
    $("#id_get_owner_name").change(function (e) {
        let formData = new FormData();
        formData.append('tenant_allocation_seleted_flat', this.value);
        let headers = {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
        };

        $.ajax({
            url: '/tenent-allocation/',
            method: 'POST',
            data: formData,
            headers: headers,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Success");
                if(response.get_owner_name){
                    $('#id_flat_primary_owner').val(response.get_owner_name)
                }
                if(response.owner_not_found_placeholder){
                    $('#id_flat_primary_owner').val('');
                    $('#id_flat_primary_owner').attr('placeholder', response.owner_not_found_placeholder);
                }
            },
            error: function (xhr) {
                alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
            }
        });
    });

    // GET TENANT NAME BASED ON TENANT PAN
    $("#id_tenant_aadhar_pan").on('input', function() {
            let input_value = $(this).val();
            // if (input_value.length >= 10) {
                // 12 digits aadhar, 10 digits pan

                let formData = new FormData();
                formData.append('id_tenant_aadhar_pan', this.value);
                let headers = {
                    "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
                };

                $.ajax({
                    url: '/tenent-allocation/',
                    method: 'POST',
                    data: formData,
                    headers: headers,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log("Success");
                        if(response.tenant_name){
                            $('#id_tenant_name').val(response.tenant_name)
                        }
                        if(response.tenant_name_placeholder){
                            $('#id_tenant_name').val('');
                            $('#id_tenant_name').attr('placeholder', response.tenant_name_placeholder);
                        }
                    },
                    error: function (xhr) {
                        alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                    }
                });
            // }         
        });   

    // POST METHOD FOR TENANT ALLOCATION
    $("#allocateTenant").click(function (e) {
        let isValid = true;       

        let required_fields = {
            'id_get_owner_name': 'Pls select flat!',
            'id_flat_primary_owner': 'Flat owner name is required!',
            'id_tenant_name': 'Tenant name is required!',
            'id_tenant_aadhar_pan': 'Tenant pan/aadhar is required!',
            'id_tenant_period_from': 'Tenant from date is required!',
            // 'id_tenant_period_to': 'Tenant to date is required!',
            'id_tenant_agreement': 'Tenant agreement is required!',
            'id_tenant_noc': 'Tenant NOC is required!',
        }

        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val() ? $("#" + key).val().trim() : $("#" + key).val();
                if (value === "") {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", "");
                    $("#" + key + "_Error").text("");
                }
            }
            return isValid;
        }

        if (!validateForm()) {
            return false;
        } else {
            let form_fields = [
                'get_owner_name', 'flat_primary_owner', 'tenant_name', 'tenant_aadhar_pan', 'tenant_period_from', 
                'tenant_period_to', 'tenant_agreement', 'tenant_noc'
            ]
            let tenentData = {};
            let formData = new FormData();
            form_fields.forEach(function (field) {
                if ($('#id_' + field).prop('type') === 'file') {
                    formData.append(field, $('#id_' + field)[0].files[0]);
                } else {
                    tenentData[field] = $('#id_' + field).val();
                }
            });
            formData.append('tenentData', JSON.stringify(tenentData));
            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: '/tenent-allocation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    toastr.success(response.message, "Tenent Allocated!");
                    setTimeout(function () {
                        location.reload();
                    }, 600);
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });     



    $('#tenentCreation').click(function (e) {
        let isValid = true;       

        let required_fields = {
            'id_tenent_name': 'Name is required!',
            'id_tenent_pan_number': 'PAN number is required!',
            'id_tenent_pan_doc': 'PAN document is required!',
            'id_tenent_contact': 'Contact number is required!',
            'id_tenent_aadhar_number': 'Aadhar number is required!',
            'id_tenent_aadhar_doc': 'Aadhar document is required!',
            'id_tenent_address': 'Address is required!',
            'id_tenent_state': 'State is required!',
            'id_tenent_city': 'City is required!',
            'id_tenent_pin_code': 'Pin code is required!',
            'id_tenent_email': 'Email is required!',
            'id_tenent_other_doc': 'Other document is required!',
            'id_tenent_doc_specification': 'Document specification is required!'
        }

        function validateForm(step) {
            for (let key in required_fields) {
                let value = $("#" + key).val() ? $("#" + key).val().trim() : $("#" + key).val();
                if (value === "") {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]);
                } else {
                    $("#" + key).css("border-color", "");
                    $("#" + key + "_Error").text("");
                }
            }
            return isValid;
        }

        if (!validateForm()) {
            return false;
        } else {
            let form_fields = [
                "tenent_name", "tenent_pan_number", "tenent_pan_doc", "tenent_contact", "tenent_aadhar_number", 
                "tenent_aadhar_doc", "tenent_address", "tenent_state", "tenent_city", "tenent_pin_code", 
                "tenent_email", "tenent_other_doc", "tenent_doc_specification",
            ]
            let tenentData = {};
            let formData = new FormData();
            form_fields.forEach(function (field) {
                if ($('#id_' + field).prop('type') === 'file') {
                    formData.append(field, $('#id_' + field)[0].files[0]);
                } else {
                    tenentData[field] = $('#id_' + field).val();
                }
            });
            formData.append('tenentData', JSON.stringify(tenentData));
            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: '/tenent-allocation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Success");
                    // if (response.reg_number) {
                    // }
                    toastr.success(response.message, "Tenent Added!");
                    $("#tenentForm")[0].reset();
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });

    $('#tenentAllocation').on('hidden.bs.modal', function() {
        form_fields = [
            'id_get_owner_name', 'id_flat_primary_owner', 'id_tenant_name', 'id_tenant_aadhar_pan', 'id_tenant_period_from', 'id_tenant_agreement', 'id_tenant_noc'
        ]
        form_fields.forEach(function (key) {
            $("#" + key + "_Error").text("");
            $("#" + key).css("border-color", "");
        });
        $('#allocateTenantForm')[0].reset(); 
      });
    
    // GET OWNER NAME FOR HOUSE HELP
    $("#id_get_hh_flat_owner_name").change(function (e) {
        let formData = new FormData();
        formData.append('hh_flat_owner_name', this.value);
        let headers = {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
        };

        $.ajax({
            url: '/house-help-allocation/',
            method: 'POST',
            data: formData,
            headers: headers,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Success");
                if(response.get_owner_name){
                    console.log("OWNER NAME=====", response.get_owner_name)
                    $('#id_flat_primary_owner_hh').val(response.get_owner_name)
                }
                if(response.owner_not_found_placeholder){
                    $('#id_flat_primary_owner_hh').val('');
                    $('#id_flat_primary_owner_hh').attr('placeholder', response.owner_not_found_placeholder);
                }
            },
            error: function (xhr) {
                alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
            }
        });
    });


    // GET TENANT NAME BASED ON TENANT PAN
    $("#id_hh_aadhar_pan").on('input', function() {
        let input_value = $(this).val();
        // if (input_value.length >= 10) {
            // 12 digits aadhar, 10 digits pan

            let formData = new FormData();
            formData.append('id_hh_aadhar_pan', this.value);
            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: '/house-help-allocation/',
                method: 'POST',
                data: formData,
                headers: headers,
                processData: false,
                contentType: false,
                success: function (response) {
                    if(response.hh_name){
                        $('#id_hh_name').val(response.hh_name)
                        $('#id_hh_role').val(response.hh_role)                        
                    }
                    if(response.hh_name_placeholder){
                        console.log("placehold=============")
                        $('#id_hh_name').val('');
                        $('#id_hh_name').attr('placeholder', response.hh_name_placeholder);
                        $('#id_hh_role').val('');
                        $('#id_hh_role').attr('placeholder', response.hh_role_placeholder);
                    }
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
        // }         
    });
      
});



function editAllocatedTenant(id){
    let tenant_allocation_id = id;
    let formData = new FormData();
    formData.append('tenant_allocation_id', tenant_allocation_id);
    let headers = {
        "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
    };

    $.ajax({
        url: '/tenant-allocation-edit/',
        method: 'POST',
        data: formData,
        headers: headers,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Success");
            // toastr.success(response.message, "Tenent Added!");
            // $("#tenentForm")[0].reset();
            if (response.tenant_obj) {
                let tenantJson = JSON.parse(response.tenant_obj);
                console.log("tenantJson", tenantJson);
                let htmlContent = '';
                $('#allocateTenantFormEdit')[0].reset(); 
                tenantJson.forEach(function(item) {
                    console.log("DATA====")
                    let aadhar_or_pan = item.tenant_aadhar_number || item.tenant_pan_number;
                    $('#id_flat_primary_owner_Edit').val(item.flat_primary_owner);
                    $('#id_get_owner_name_Edit').val(item.wing_flat__unit_flat_unique);
                    $('#id_tenant_aadhar_pan_Edit').val(aadhar_or_pan);
                    $('#id_tenant_name_Edit').val(item.tenent_name__tenent_name);
                    $('#id_tenant_period_from_Edit').val(item.tenant_from_date);
                    $('#id_tenant_period_to_Edit').val(item.tenant_to_date);
                    // htmlContent =+ `
                    // <h1>EDIT============</h1>
                    // `;            
                    // $('#allocateTenantForm').html(htmlContent);
                    // SET THE VALUE OF DOC HERE 
                });
            }            
        },
        error: function (xhr) {
            alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        }
    });
}

// preview file for every file input
function PreviewImage(doc) {
    var doc = doc;
    pdffile = document.getElementById(`${doc}`).files[0];
    pdffile_url = URL.createObjectURL(pdffile);
    $('#viewer').attr('src', pdffile_url);
    window.open(pdffile_url);
}


// other doc add js start
var i = 0;
function addOtherDoc() {
    const newDiv = document.createElement('div');
    newDiv.className = 'd-flex isVisible';

    const newDiv1 = document.createElement('div');
    newDiv1.className = 'sty-input-wrapper';
    const newDiv2 = document.createElement('div');
    newDiv2.className = 'sty-input-wrapper';

    document.getElementById('CloneContainer').appendChild(newDiv);

    var newInp = document.createElement('input');
    newInp.type = 'file';
    newInp.className = 'sty-inp form-control';
    newInp.id = `attachDoc${i}`;
    newDiv1.appendChild(newInp);

    var newInpLabel = document.createElement('label');
    newInpLabel.textContent = 'Other Document';
    newInpLabel.className = 'sty-label';
    newDiv1.appendChild(newInpLabel);

    var newInpText = document.createElement('input');
    newInpText.type = 'text';
    newInpText.className = 'sty-inp form-control';
    newInpText.id = `DocFieldAttach${i}`;
    let dj = newInpText.id;
    newDiv2.appendChild(newInpText);

    var newInpTextLabel = document.createElement('label');
    newInpTextLabel.textContent = 'Specify your Document';
    newInpTextLabel.className = 'sty-label';
    newDiv2.appendChild(newInpTextLabel);

    var errMsg1 = document.createElement('small');
    // errMsg1.textContent = "Sameer";
    errMsg1.className = "mb-3 error-message";
    errMsg1.id = `attachDoc${i}_Error`;
    newDiv1.appendChild(errMsg1);

    var errMsg2 = document.createElement('small');
    // errMsg2.textContent = "Sameer-2";
    errMsg2.className = "mb-3 error-message";
    errMsg2.id = `DocFieldAttach${i}_Error`;
    newDiv2.appendChild(errMsg2);


    var viewButton = document.createElement('button');
    viewButton.innerHTML = '<i class="fa-solid fa-eye" style="color: #2b96f1 !important;"></i>';
    // viewButton.title = 'View' + ' ' + `${viiew}` + ' ' + 'File';
    viewButton.className = 'sty-inp mb-4';
    viewButton.style.background = "transparent";
    // viewButton.style.background = '#6ebbff';
    // viewButton.onclick = preeView(attachment.id);

    viewButton.addEventListener('click', () => {
        event.preventDefault();
        // var doc = attachmentField.id;
        var pdffile = document.getElementById(dj).files[0];
        if (pdffile) {
            pdffile_url = URL.createObjectURL(pdffile);
            $('#viewer').attr('src', pdffile_url);
            window.open(pdffile_url);
        } else {
            alert("No File Selected.");
        }
    });

    var removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fa-solid fa-trash-can" style="color: red !important;"></i>';
    removeButton.className = "sty-inp mb-4 ms-2";
    removeButton.style.background = "transparent";



    removeButton.addEventListener('click', () => {
        event.preventDefault();
        newDiv.remove();
        // newInp.id = '';
        // errMsg1.id = '';
        // errMsg2.id = '';
        // newInpText.id = '';
    });

    i = i + 1;
    newDiv.appendChild(newDiv1);
    newDiv.appendChild(newDiv2);
    newDiv.appendChild(viewButton);
    newDiv.appendChild(removeButton);
}
// other doc add js end


// other bank add js start
let j = 2; // Initialize j globally or in an appropriate scope

function addOtherBankDetail() {
    let mainClone = document.createElement('div');
    mainClone.className = 'row mb-2';

    function createInputElement(labelText, inputId) {
        const newDiv = document.createElement('div');
        newDiv.className = 'col-lg-4 mb-4';

        const newDivWrapper = document.createElement('div');
        newDivWrapper.className = 'sty-input-wrapper w-100';
        newDiv.appendChild(newDivWrapper);

        const newInp = document.createElement('input');
        newInp.type = 'text';
        newInp.className = 'w-100 sty-inp';
        newInp.id = inputId;
        newDivWrapper.appendChild(newInp);

        const newInpLabel = document.createElement('label');
        newInpLabel.textContent = labelText;
        newInpLabel.className = 'sty-label';
        newDivWrapper.appendChild(newInpLabel);

        const errorMsg = document.createElement('small');
        errorMsg.className = 'mb-3 error-message';
        errorMsg.id = `${inputId}_Error`;
        newDivWrapper.appendChild(errorMsg);

        // const newInpLabel1 = document.createElement('label');
        // newInpLabel1.textContent = labelText;
        // newInpLabel1.className = 'sty-label';
        // newDivWrapper.appendChild(newInpLabel1);

        // const errorMsg1 = document.createElement('small');
        // errorMsg1.className = 'mb-3 error-message';
        // errorMsg1.id = `${inputId}_Error`;
        // newDivWrapper.appendChild(errorMsg1);

        // checkbox start
        // const checkBoxLabel = document.createElement('label');
        // checkBoxLabel.textContent = "Make primary?";
        // checkBoxLabel.className = 'sty-label';
        // newDiv.appendChild(checkBoxLabel);

        // const checkBoxInput = document.createElement('input');
        // checkBoxInput.type = 'checkbox';
        // checkBoxInput.className = 'w-100 sty-inp';
        // checkBoxInput.id = inputId;
        // newDiv.appendChild(checkBoxInput);
        // checkbox end

        return newDiv;
    }

    const newDiv = createInputElement('Beneficiary Name', `id_beneficiary_name${j}`);
    const ifscCode = createInputElement('Beneficiary IFSC CODE', `id_beneficiary_code${j}`);
    const accNumber = createInputElement('Beneficiary ACCOUNT NUMBER', `id_beneficiary_acc_number${j}`);
    const branch = createInputElement('Beneficiary BANK NAME & BRANCH', `id_beneficiary_bank${j}`);
    // const checkbox = createInputElement('Beneficiary BANK NAME & BRANCH', `id_beneficiary_bank${j}`);
    // const checkbox = createInputElement('Make primary?', `id_beneficiary_bank${j}`, true);


    const checkBoxDiv = document.createElement('div');
    checkBoxDiv.className = 'col-lg-4 mb-4 d-flex gap-3 align-items-center';
    mainClone.appendChild(checkBoxDiv);

    const checkBoxInp = document.createElement('input');
    checkBoxInp.type = 'checkbox';
    checkBoxInp.className = 'sty-inp';
    checkBoxInp.id = `id_isPrimary${j}`;
    // checkBoxInp.textContent = 'make this Primary';
    checkBoxDiv.appendChild(checkBoxInp);



    const checkBoxLabel = document.createElement('label');
    // checkBoxLabel.className = 'sty-label';
    checkBoxLabel.textContent = 'Make this Primary';
    checkBoxDiv.appendChild(checkBoxLabel);

    const checkboxErrorMsg = document.createElement('small');
    checkboxErrorMsg.className = 'mb-3 error-message';
    checkboxErrorMsg.id = `id_isPrimary${j}_Error`;
    checkBoxDiv.appendChild(checkboxErrorMsg);

    // Remove button
    const removeBank = document.createElement('button');
    removeBank.innerHTML = '<i class="fa-solid fa-trash-can" style="color: red !important;"></i>';
    removeBank.className = 'col-lg-1 sty-inp mb-5';
    removeBank.title = 'Delete this Wing Creation';
    removeBank.style.background = 'transparent';
    removeBank.addEventListener('click', () => {
        event.preventDefault();
        mainClone.remove();
    });

    j = j + 1; // Increment j within the function scope

    document.getElementById('bankCloneContainer').appendChild(mainClone);
    mainClone.appendChild(newDiv);
    mainClone.appendChild(ifscCode);
    mainClone.appendChild(accNumber);
    mainClone.appendChild(branch);
    mainClone.appendChild(checkBoxDiv);
    mainClone.appendChild(removeBank);
}






// other bank add js end


// wing creation start

var incWing = 1;
function addWing() {
    const newWing = document.createElement('div');
    newWing.className = 'row';

    document.getElementById('wingFlatForm').appendChild(newWing);

    const newWingName = document.createElement('div');
    newWingName.className = 'col-lg-3';
    newWing.appendChild(newWingName);

    const newUnitName = document.createElement('div');
    newUnitName.className = 'col-lg-5';
    newWing.appendChild(newUnitName);

    const newWingNameWrapper = document.createElement('div');
    newWingNameWrapper.className = 'sty-input-wrapper w-100';

    const newUnitNameWrapper = document.createElement('div');
    newUnitNameWrapper.className = 'sty-input-wrapper w-100';

    const newWingNameInp = document.createElement('input');
    newWingNameInp.type = 'text';
    newWingNameInp.className = 'w-100 sty-inp form-control mb-1';
    newWingNameInp.id = `wingName${incWing}`;
    newWingNameWrapper.appendChild(newWingNameInp);

    const newWingNameLabel = document.createElement('label');
    newWingNameLabel.textContent = 'Enter your Wing Name';
    newWingNameLabel.className = 'sty-label';
    newWingNameWrapper.appendChild(newWingNameLabel);

    // Add a <small> tag after the sty-input-wrapper
    const smallTag1 = document.createElement('small');
    smallTag1.id = `wingName${incWing}_Error`;
    // smallTag1.textContent = "This is small tag 1";
    smallTag1.className = "error-message";
    newWingNameWrapper.appendChild(smallTag1);

    const newUnitNameInp = document.createElement('textarea');
    newUnitNameInp.className = 'w-100 sty-inp';
    newUnitNameInp.id = `unitName${incWing}`;
    newUnitNameInp.rows = '1';
    newUnitNameWrapper.appendChild(newUnitNameInp);

    const smallTag2 = document.createElement('small');
    // smallTag2.textContent = "This is small tag 2";
    smallTag2.id = `unitName${incWing}_Error`;
    smallTag2.className = "error-message";
    newUnitNameWrapper.appendChild(smallTag2);

    const newUnitNameLabel = document.createElement('label');
    newUnitNameLabel.textContent = 'Enter your Flat Numbers';
    newUnitNameLabel.className = 'sty-label';
    newUnitNameWrapper.appendChild(newUnitNameLabel);

    const removeWing = document.createElement('button');
    removeWing.innerHTML = '<i class="fa-solid fa-trash-can" style="color: red !important;"></i>';
    removeWing.className = "col-lg-1 sty-inp mb-5";
    removeWing.title = 'Delete this Wing Creation';
    removeWing.style.background = "transparent";
    removeWing.addEventListener('click', () => {
        event.preventDefault();
        newWing.remove();
    });
    incWing = incWing + 1;
    newWingName.appendChild(newWingNameWrapper);
    newUnitName.appendChild(newUnitNameWrapper);
    newWing.appendChild(removeWing);
}



// add nominee start
var incNominee = 1;

function addNomineeOnEditForm(id) {
    const templateNominee = document.getElementById(id);
    const clonedNominee = templateNominee.cloneNode(true);

    // Remove red border color from the cloned form
    const formInputs = clonedNominee.querySelectorAll("input, textarea, select");
    formInputs.forEach(function (input) {
        input.style.borderColor = ""; // Reset border color to default
    });

    // Remove error messages from the cloned form and update IDs
    const errorMessages = clonedNominee.querySelectorAll(".error-message");
    errorMessages.forEach(function (errorMsg) {
        let currentId = errorMsg.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/(\d+)?_Error$/, incNominee + "_Error");
            errorMsg.setAttribute("id", newId);
            errorMsg.textContent = ""; // Clear error message text
        }
    });

    const inputs = clonedNominee.querySelectorAll("input, textarea, select");
    inputs.forEach(function (input) {
        let currentId = input.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/\d+$/, incNominee);
            input.setAttribute("id", newId + incNominee);
            input.value = "";
        }
    });

    incNominee++;
    clonedNominee.id = "";
    document.getElementById(id + '_cloned').appendChild(clonedNominee);
    // document.getElementById(id + '_heading').innerHTML("New Heading");


}
// add nomine end


// ADD NOMINEE ON EDIT VIEW
function addNominee() {
    const templateNominee = document.getElementById("cloneNominee");
    const clonedNominee = templateNominee.cloneNode(true);

    // Remove red border color from the cloned form
    const formInputs = clonedNominee.querySelectorAll("input, textarea, select");
    formInputs.forEach(function (input) {
        input.style.borderColor = ""; // Reset border color to default
    });

    // Remove error messages from the cloned form and update IDs
    const errorMessages = clonedNominee.querySelectorAll(".error-message");
    errorMessages.forEach(function (errorMsg) {
        let currentId = errorMsg.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/(\d+)?_Error$/, incNominee + "_Error");
            errorMsg.setAttribute("id", newId);
            errorMsg.textContent = ""; // Clear error message text
        }
    });

    const inputs = clonedNominee.querySelectorAll("input, textarea, select");
    inputs.forEach(function (input) {
        let currentId = input.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/\d+$/, incNominee);
            input.setAttribute("id", newId + incNominee);
            input.value = "";
        }
    });

    incNominee++;
    clonedNominee.id = "";
    document.getElementById("newNominee").appendChild(clonedNominee);
}
// ADD NOMINEE ON EDIT VIEW




// -------Toggle NOC in Home Loan Details Starts -------

let selectElement = document.getElementById("id_bank_loan_status");
let toggleContent = document.getElementById("toggleChangeNoc");
let fileField = document.getElementById("id_bank_loan_noc_file");
let fileFieldError = document.getElementById("id_bank_loan_noc_file_Error");

if (selectElement) {
    selectElement.addEventListener("change", function () {
        let selectedValue = selectElement.value;

        toggleContent.style.display = "none";
        fileField.style.borderColor = "";
        fileFieldError.innerHTML = "";
        toggleContent.classList.remove("activeStatus");
        if (selectedValue === "Active") {
            // alert("call");
            toggleContent.style.display = "block";
            toggleContent.classList.add("activeStatus");
            fileField.style.borderColor = "";
            fileFieldError.innerHTML = "";
        }
    });
}

// -------Toggle NOC in Home Loan Details Ends -------





// -------Toggle Vehicle Parking Charges in Vehicle Details Starts -------
var incVehChange = 1;
function selectChange(idVal, idValInput, chargableAmount) {
    // alert(idVal);
    // alert(idValInput);
    // alert(chargableAmount);
    var selectElement = document.getElementById(idVal);
    // var enableField = document.getElementById(idValInput);
    // var addChargeDiv = document.getElementById("addCharge0");
    // var enableField = document.getElementById('chargeAmnt0');
    // console.log("enableField", enableField)

    // alert("change")
    if (selectElement.value === "yes") { // "option2" corresponds to "YES"
        // addChargeDiv.style.display = "block";
        // alert("true")
        // enableField.disabled = false;
        // $("#hidden_charge_amount").show();
        // alert(idValInput);
        // alert(chargableAmount);
        if (!document.getElementById('new_' + chargableAmount)) {
            var inputElement = $(`
        <input type="text" class="w-100 sty-inp" id="new_${chargableAmount}" />
        <label for="" class="sty-label">Charge Amount</label>       
        <small id="Error_new_${chargableAmount}" class="error-message"></small>             
        `);

            // Append the input element to the container
            $("#" + chargableAmount).append(inputElement);
        }
    } else {
        // alert("false")
        // addChargeDiv.style.display = "none";
        // enableField.disabled = true;
        $("#" + chargableAmount).empty();
        // $("#hidden_charge_amount").hide();
    }
}


// $("#id_select_vehicle_charge").change(function () {
//     // Get the selected value
//     var selectedValue = $(this).val();
//     // alert(selectedValue);

//     // Check if the selected value is "yes"
//     if (selectedValue === "yes") {
//         // alert("call")
//         // Create an input element
//         $("#hidden_charge_amount").show();
//         var inputElement = $(`
//         <input type="text" class="w-100 sty-inp" id="parkingLot0" />
//         <label for="" class="sty-label">Parking Lot</label>                    
//         `);

//         // Append the input element to the container
//         $("#chargeAmountInputContainer").append(inputElement);
//     } else {
//         // Remove the contents of the container if it exists
//         $("#chargeAmountInputContainer").empty();
//         $("#hidden_charge_amount").hide();
//     }
// });




// -------Vehicle Addition Starts -------
var incVehicle = 1;

function addVehicle() {
    const cloneVehicle = document.getElementById("cloneVehicle");
    const clonedVehicle = cloneVehicle.cloneNode(true);

    // Remove red border color from the cloned form
    const formInputs = clonedVehicle.querySelectorAll("input, textarea, select");
    formInputs.forEach(function (input) {
        input.style.borderColor = ""; // Reset border color to default
    });

    // Remove error messages from the cloned form and update IDs
    const errorMessages = clonedVehicle.querySelectorAll(".error-message");
    errorMessages.forEach(function (errorMsg) {
        let currentId = errorMsg.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/(\d+)?_Error$/, incNominee + "_Error");
            errorMsg.setAttribute("id", newId);
            errorMsg.textContent = ""; // Clear error message text
        }
    });

    const elementsToUpdate = clonedVehicle.querySelectorAll("input, textarea, select, small");
    elementsToUpdate.forEach(function (element) {
        let currentId = element.getAttribute("id");
        if (currentId) {
            let newId = currentId.replace(/\d+$/, incVehicle);
            element.setAttribute("id", newId);

            // Clear the value for input and textarea elements
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.value = "";
            }
        }
    });

    // Update ID for the related div
    const relatedDiv = clonedVehicle.querySelector("#vehicle_id_select_charge0");
    if (relatedDiv) {
        let newRelatedId = relatedDiv.getAttribute("id").replace(/\d+$/, incVehicle);
        relatedDiv.setAttribute("id", newRelatedId);
    }

    incVehicle++;
    clonedVehicle.id = "";

    document.getElementById("newVehicle").appendChild(clonedVehicle);
}



// MEMBER TABLE SCRIPT
$(document).ready(function () {
    // Define a custom filter function
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            // Customize this logic based on your needs
            var customStatus = data[1]; // Assuming the status is in the third column (adjust as needed)

            // Get the selected value from the dropdown
            var selectedStatus = $('#statusFilterDropdown').val();
            console.log("selectedStatus==========", selectedStatus)
            
            if (selectedStatus === 'Active') {
                return customStatus === 'Active';
            } else if (selectedStatus === 'Inactive') {
                return customStatus === 'Inactive';
            }
            return true;
            // Apply the filter based on the selected status
            
        }
    );
    var table = $('#example').DataTable({
        // dom: 'Bfrtip', // Include the buttons extension
        "dom": '<"dt-buttons"Br><"clear">ftipl',         //Qlfrtip
        // buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        responsive: true,
        
        buttons: [
            {
        extend: 'colvis',
        text: 'More Column',
        postfixButtons: [
        'colvisRestore'
        ]
    },
    {
        extend: 'searchBuilder',
        text: 'Filter'
    },
    {
        extend: 'print',
        exportOptions: {
            // columns: ':visible',
            columns: ':visible:not(.exclude-print)', // Exclude columns with the class 'exclude-print'
            modifier: { search: 'applied', order: 'applied' },
            
        }
    },
    {
        extend: 'print',
        text: 'Print All',
        exportOptions: {
            columns: '*:not(.exclude-print)' // Exclude columns with the class 'exclude-print'
            // modifier: { search: 'applied', order: 'applied' },
            
        }
    },
    
    
],

order: [],
"stripeClasses": [],

columnDefs: [
    
    {"visible": true, "targets": [0,1,2,3,4]},
    {"visible": false, "targets": '_all'},
],
fixedColumns: {
    left: 2
},
// "paging": true,
// 'pageLength': '5',
pagingType: "simple",
  paginate: {
    previous: "<",
    next: ">"
  },
scrollCollapse: false,
scrollX: true
});

let statusDD = $(
    '<select class="dt-button ms-2 dt-button-custom dataTable-Text" id="statusFilterDropdown"><option value="all">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select>')
.on('change', function () {
    table.draw();
});

$('#example_filter').append(statusDD);

// Set the DataTable info text to be centered
$('#example_info').css({
    'text-align': 'center',
    'position': 'relative',
    'left': '40%',
    'padding-top': '20px',
    // 'margin-right': 'auto',
    'display': 'block'
});

// Adjust the info text position when the table is redrawn
table.on('draw.dt', function () {
    $('#example_info').css({
        'text-align': 'center',
        'margin-left': 'auto',
        'margin-right': 'auto'
    });
});


});


// GET CSRF TOKEN
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
// GET CSRF TOKEN



function updateMemberDetails(id) {
    // alert(id);
    let formData = new FormData();
    formData.append('member_id', id);

    $.ajax({
        url: '/member-details-view/',
        method: 'POST',
        data: formData,
        headers: {
            'X-CSRFToken': csrftoken
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Success")
            if (response.all_member_json) {
                let memberData = JSON.parse(response.all_member_json)
                let sharesData = JSON.parse(response.shares_details)
                let homeLoanData = JSON.parse(response.home_loan_obj)
                let gstData = JSON.parse(response.gst_obj)
                let vehicleData = JSON.parse(response.vehicle_obj)
                let htmlContent = '';
                let sharedContent = '';
                let homeLoanContent = '';
                let gstContent = '';
                let vehicleContent = '';
                memberData.forEach(function (item) {
                    for (var key in item) {
                        if (item[key] === null) {
                            item[key] = "-";
                        }
                    }
                    // Append member details
                    htmlContent +=
                        `
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" id="heading" data-bs-toggle="collapse" data-bs-target="#collapse${item.member_id}" aria-expanded="true" aria-controls="collapse${item.member_id}">
                                    ${item.member_name}
                                </button>
                            </h2>
                            <div id="collapse${item.member_id}" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    
                                    <div class="row mt-3">
                                        <div class="col-lg-3">
                                            <p class="ms-3 view-label">Member's Name</p>
                                        </div>
                                        <div class="col-lg-9">
                                            <p class=" view-inps">${item.member_name}</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Flat Number</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">A-1001</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">Ownership %</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.ownership_percent}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Position</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">${item.member_position}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">Date of Birth</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.member_dob}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Aadhaar Number</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">${item.member_aadhar_no}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">PAN Number</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.member_pan_no}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Permanent Address</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">${item.member_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row m-0 p-0">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">State</p>
                                                </div>
                                                <div class="col-lg-3">
                                                    <p class="view-inps">${item.member_state}</p>
                                                </div>
                                                <div class="col-lg-3">
                                                    <p class="ms-3 view-label">Pincode</p>
                                                </div>
                                                <div class="col-lg-2">
                                                    <p class="view-inps">${item.member_pin_code}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Email Id</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">${item.member_email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">Occupation</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.member_occupation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <p class="ms-3 view-label">Contact Number</p>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="view-inps">${item.member_contact}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">Emergency Contact Number</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.member_emergency_contact}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="ms-3 view-label">Primary Member:</p>
                                                </div>
                                                <div class="col-lg-8">
                                                    <p class="view-inps">${item.member_is_primary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <hr class="m-0 p-0">
                    `

                    // Append nominee details
                    if (item.nominee_Details.length > 0) {
                        item.nominee_Details.forEach(function (nominee) {
                            for (var key in nominee) {
                                if (nominee[key] === null) {
                                    nominee[key] = "-";
                                }
                            }
                            htmlContent +=
                                `
                            <h4>=============== ${nominee.nominee_name}=====================</h4>
                            <div class="row mt-3">
                                <div class="col-lg-3">
                                    <p class="ms-3 view-label">Nominee's Name</p>
                                </div>
                                <div class="col-lg-9">
                                    <p class=" view-inps">${nominee.nominee_name}</p>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Date of Nomination</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.date_of_nomination}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <p class="ms-3 view-label">Date of Birth</p>
                                        </div>
                                        <div class="col-lg-8">
                                            <p class="view-inps">${nominee.nominee_dob}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Relation with Nominator</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.relation_with_nominee}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <p class="ms-3 view-label">Nominee Sharein %</p>
                                        </div>
                                        <div class="col-lg-8">
                                            <p class="view-inps">${nominee.nominee_sharein_percent}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Nominee Aadhaar Number</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.nominee_aadhar_no}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <p class="ms-3 view-label">Nominee PAN Number</p>
                                        </div>
                                        <div class="col-lg-8">
                                            <p class="view-inps">${nominee.nominee_pan_no}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Nominee Permanent Address</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.nominee_address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <p class="ms-3 view-label">State</p>
                                        </div>
                                        <div class="col-lg-3">
                                            <p class="view-inps">${nominee.nominee_state}</p>
                                        </div>
                                        <div class="col-lg-3">
                                            <p class="ms-3 view-label">Pincode</p>
                                        </div>
                                        <div class="col-lg-2">
                                            <p class="view-inps">${nominee.nominee_pin_code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Nominee Contact Number</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.nominee_contact}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <p class="ms-3 view-label">Emergency Contact Number</p>
                                        </div>
                                        <div class="col-lg-8">
                                            <p class="view-inps">${nominee.nominee_emergency_contact}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <p class="ms-3 view-label">Nominee Email Id</p>
                                        </div>
                                        <div class="col-lg-6">
                                            <p class="view-inps">${nominee.nominee_email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                        });

                    }
                    htmlContent +=
                        `
                    </div>
                    </div>
                    </div>
                    `
                });
                sharedContent =
                `
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Folio Number</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">${sharesData[0]?.folio_number || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Serial Number of Certificate</p>
                            </div>
                                <div class="col-lg-6">
                                <p class="view-inps">2</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Share Issue Date</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">21-01-2018</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Share Transfer Date</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">21-01-2023</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Application Number</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">210</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Allotment Number</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">21</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Share Number From</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">10</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Share Number To</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">16</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Total Amount Received</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">15000</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Total Amount Received on</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">25-01-2023</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Transfer from Folio Number</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">7955</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-lg-6">
                                <p class="ms-3 view-label">Transfer to Folio Number</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="view-inps">7973</p>
                            </div>
                        </div>
                    </div>
                `
                homeLoanContent = 
                `
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Hypothication Bank Name</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">${homeLoanData[0]?.bank_loan_name || '-'}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Object of Loan</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">Home Loan</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Loan Issue Date</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">21-01-2010</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Loan Value</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">80,00,000</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Account Number</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">0123456789</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Installment</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">75</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Loan Status</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">Active</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">NOC</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">Null</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-3">
                            <p class="ms-3 view-label">Remarks</p>
                        </div>
                        <div class="col-lg-9">
                            <p class="view-inps">Lorem ipsum dolor sit amet, consectetur adipisicing
                                elit. Hic itaque dolores tempore nam laboriosam, atque cum reiciendis
                                eveniet culpa odit cupiditate eligendi explicabo aliquam adipisci error
                                soluta, iure aliquid quisquam!</p>
                        </div>
                    </div>
                </div>
                `

                gstContent = 
                `
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">GST Number</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">${gstData[0]?.gst_number || '-'}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Billing State</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">Maharashtra</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Billing Name</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">Sameer Nasir Shaikh</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-6">
                            <p class="ms-3 view-label">Contact Number</p>
                        </div>
                        <div class="col-lg-6">
                            <p class="view-inps">7977604213</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-3">
                            <p class="ms-3 view-label">Billing Address</p>
                        </div>
                        <div class="col-lg-9">
                            <p class="view-inps">3, DLH Park, S. V. Road,
                                Goregaon (West),
                                Mumbai – 400062.
                                Maharashtra, India.</p>
                        </div>
                    </div>
                </div>
                `

                if (vehicleData && vehicleData.length > 0) {
                    vehicleData.forEach(function (item) {
                        vehicleContent += 
                        ` 
                        <h4>=============== Vehicle Detail=====================</h4>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Parking Lot</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">${item.parking_lot || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Type</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Sedan</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Number</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">MH 02 CF 3786</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Brand & Modal</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Honda City - 2022</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Sticker Issued</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Yes</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Sticker Number</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">A-361</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Chargeable</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Yes</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Charge Amount</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">1500 Rs</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">RC Copy</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="hovme view-inps"><a style="text-decoration: none; color: grey;"
                                                target="_blank" rel="noopener"
                                                download="Society-Registration-Certificate.jpg"
                                                href="./images/RC Front.JPG">RC-Copy.jpg</a></p>
                                    </div>
                                </div>
                            </div>
                            <hr class="m-3 p-2">
                        `
                    });
                }else{
                    vehicleContent += 
                        ` 
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Parking Lot</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">-</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Type</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Sedan</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Number</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">MH 02 CF 3786</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Brand & Modal</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Honda City - 2022</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Sticker Issued</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Yes</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Sticker Number</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">A-361</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Vehicle Chargeable</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">Yes</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">Charge Amount</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="view-inps">1500 Rs</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <p class="ms-3 view-label">RC Copy</p>
                                    </div>
                                    <div class="col-lg-6">
                                        <p class="hovme view-inps"><a style="text-decoration: none; color: grey;"
                                                target="_blank" rel="noopener"
                                                download="Society-Registration-Certificate.jpg"
                                                href="./images/RC Front.JPG">RC-Copy.jpg</a></p>
                                    </div>
                                </div>
                            </div>
                            <hr class="m-3 p-2">
                        `
                }
                
                $('#accordionExample').html(htmlContent);
                $('#sharedContent').html(sharedContent);
                $('#homeLoanContent').html(homeLoanContent);
                $('#gstContent').html(gstContent);
                $('#vehicleContent').html(vehicleContent);
            }

        },
        error: function (xhr) {
            alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        }
    });
}







// =================================================================================


function editMemberDetails(id){
    let formData = new FormData();
    formData.append('member_id', id);

    $.ajax({
        url: '/member-details-view/',
        method: 'POST',
        data: formData,
        headers: {
            'X-CSRFToken': csrftoken
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Success");
            if (response.all_member_json) {
                let memberData = JSON.parse(response.all_member_json)
                let sharesData = JSON.parse(response.shares_details)
                let homeLoanData = JSON.parse(response.home_loan_obj)
                let gstData = JSON.parse(response.gst_obj)
                let vehicleData = JSON.parse(response.vehicle_obj)
                let wing_flat_no = JSON.parse(response.wing_flat_no)
                let htmlContent = '';
                let sharedContent = '';
                let homeLoanContent = '';
                let gstContent = '';
                let vehicleContent = '';
                let nomineeIdIncCount = 1;
                let memberIdIncCount = 1;
                let flat_and_ownership_ids = [];
                memberData.forEach(function (item) {
                    console.log("memberIdIncCount============", memberIdIncCount)
                    // Append member details
                    htmlContent +=
                        `
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button id="heading" class="accordion-button" type="button"
                                    data-bs-toggle="collapse" data-bs-target="#collapse_edit${item.member_id}" aria-expanded="true" aria-controls="collapse_edit${item.member_id}">
                                    ${item.member_name}
                                </button>
                            </h2>
                            <div id="collapse_edit${item.member_id}" class="accordion-collapse collapse show"
                                data-bs-parent="#member-edit-accordian">
                                <div class="accordion-body">
                                    <form action="">
                                        <div class="row mt-3 ps-4 pe-4" style="text-align: left">
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <select id="id_wing_flat" class="w-100 sty-inp">
                                            `
                                                    Object.keys(wing_flat_no).forEach(function(key) {
                                                        htmlContent += `
                                                            <option value="${key}">${wing_flat_no[key]}</option>;
                                                            `
                                                        });
                                                htmlContent += `
                                                    </select>
                                                    </div>
                                                    <label for="id_wing_flat" class="sty-label">Wing & Flat No.</label>
                                                    <small id="id_wing_flat_Error" class="error-message"></small>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="text" class="w-100 sty-inp" value="${item.member_name}" id="id_member_name" />
                                                    <label for="id_member_name" class="sty-label">Member's Name</label>
                                                    <small id="id_member_name_Error" class="error-message"></small>
                                                </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="text" class="w-100 sty-inp percentage-input" id="id_member_ownership${memberIdIncCount}" />
                                                    <label for="id_member_ownership${memberIdIncCount}" class="sty-label">Ownership %</label>
                                                    <small id="id_member_ownership${memberIdIncCount}_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <select class="w-100 sty-inp form-control" id="id_member_position">
                                                        <option value="">Select Position</option>
                                                        <option value="associate-member">Associate Member</option>
                                                        <option value="chairman">Chairman</option>
                                                        <option value="secretary">Secretary</option>
                                                        <option value="treasurer">Treasurer</option>
                                                    </select>
                                                    <label for="id_member_position" class="sty-label">Position</label>
                                                    <small id="id_member_position_Error" class="error-message"></small>
                                                </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="date" class="w-100 sty-inp form-control" id="id_member_dob" />
                                                    <label for="id_member_dob" class="sty-label">Member DOB</label>
                                                    <small id="id_member_dob_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="text" class="w-100 sty-inp" id="id_member_pan_number"/>
                                                    <label for="id_member_pan_number" class="sty-label">Member PAN No</label>
                                                    <small id="id_member_pan_number_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="number" class="w-100 sty-inp" id="id_member_aadhar_no"/>
                                                    <label for="id_member_aadhar_no" class="sty-label">Member Aadhaar No</label>
                                                    <small id="id_member_aadhar_no_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <textarea class="w-100 sty-inp form-control" id="id_member_address" cols="30" rows="1"></textarea>
                                                    <label for="id_member_address" class="sty-label">Member Permanent Address</label>
                                                    <small id="id_member_address_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <select class="w-100 sty-inp form-control" id="id_member_state">
                                                        <option value="">Select your State</option>
                                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                        <option value="Assam">Assam</option>
                                                        <option value="Bihar">Bihar</option>
                                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                                        <option value="Goa">Goa</option>
                                                        <option value="Gujarat">Gujarat</option>
                                                        <option value="Haryana">Haryana</option>
                                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                                        <option value="Jharkhand">Jharkhand</option>
                                                        <option value="Karnataka">Karnataka</option>
                                                        <option value="Kerala">Kerala</option>
                                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                        <option value="Maharashtra">Maharashtra</option>
                                                        <option value="Manipur">Manipur</option>
                                                        <option value="Meghalaya">Meghalaya</option>
                                                        <option value="Mizoram">Mizoram</option>
                                                        <option value="Nagaland">Nagaland</option>
                                                        <option value="Odisha">Odisha</option>
                                                        <option value="Punjab">Punjab</option>
                                                        <option value="Rajasthan">Rajasthan</option>
                                                        <option value="Sikkim">Sikkim</option>
                                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                                        <option value="Telangana">Telangana</option>
                                                        <option value="Tripura">Tripura</option>
                                                        <option value="Uttar Pradesh">
                                                            Uttar Pradesh
                                                        </option>
                                                        <option value="Uttarakhand">Uttarakhand</option>
                                                        <option value="West Bengal">West Bengal</option>
                                                        <option value="Andaman and Nicobar ">
                                                            Andaman and Nicobar
                                                        </option>
                                                        <option value="Islands">Islands</option>
                                                        <option value="Dadra and Nagar Haveli">
                                                            Dadra and Nagar Haveli
                                                        </option>
                                                        <option value="Daman and Diu">
                                                            Daman and Diu
                                                        </option>
                                                        <option value="Delhi">Delhi</option>
                                                        <option value="Ladakh">Ladakh</option>
                                                        <option value="Lakshadweep">Lakshadweep</option>
                                                        <option value="Puducherry">Puducherry</option>
                                                    </select>
                                                    <label for="id_member_state" class="sty-label">State</label>
                                                    <small id="id_member_state_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="number" class="w-100 sty-inp" id="id_member_pin_code"/>
                                                    <label for="id_member_pin_code" class="sty-label">Pin Code</label>
                                                    <small id="id_member_pin_code_Error" class="error-message"></small>
                                                </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="email" class="w-100 sty-inp" id="id_member_email" />
                                                    <label for="id_member_email" class="sty-label">Member Email</label>
                                                    <small id="id_member_email_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="number" class="w-100 sty-inp form-control" id="id_member_contact"/>
                                                    <label for="id_member_contact" class="sty-label">Member Contact No.</label>
                                                    <small id="id_member_contact_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="number" class="w-100 sty-inp" id="id_member_emergency_contact"/>
                                                    <label for="id_member_emergency_contact" class="sty-label">Emergency Contact No.</label>
                                                    <small id="id_member_emergency_contact_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="text" class="w-100 sty-inp" id="id_member_occupation" />
                                                    <label for="id_member_occupation" class="sty-label">Occupation</label>
                                                    <small id="id_member_occupation_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            

                                            <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                                <input type="date" class="w-100 sty-inp" id="id_date_of_admission" />
                                                <label for="id_date_of_admission" class="sty-label">Date of admission</label>
                                                <small id="id_date_of_admission_Error" class="error-message"></small>
                                            </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                                <select id="id_flat_status" class="w-100 sty-inp" id="id_member_flat_status">
                                                <option value="">Select Status</option>
                                                <option value="owned">Owned</option>
                                                <option value="rented">Rented</option>
                                                <option value="vacant">Vacant</option>
                                                <option value="black_listed">Black Listed</option>
                                                </select>
                                                <label for="id_member_flat_status" class="sty-label">Status</label>
                                                <small id="id_member_flat_status_Error" class="error-message"></small>
                                            </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                                <input type="date" class="w-100 sty-inp" id="id_date_of_entrance_fees" />
                                                <label for="id_date_of_entrance_fees" class="sty-label">Date of entrance fees</label>
                                                <small id="id_date_of_entrance_fees_Error" class="error-message"></small>
                                            </div>
                                            </div>

                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="date" class="w-100 sty-inp" id="id_date_of_cessation"/>
                                                    <label for="id_date_of_cessation" class="sty-label">Date of cessation</label>
                                                    <small id="id_date_of_cessation_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 mb-3">
                                                <div class="w-100 sty-input-wrapper">
                                                    <input type="text" class="w-100 sty-inp" id="id_cessation_reason" />
                                                    <label for="id_cessation_reason" class="sty-label">Reason for cessation</label>
                                                    <small id="id_cessation_reason_Error" class="error-message"></small>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 d-flex align-items-center">
                                            <small id="id_is_primary">
                                                <span>
                                                <input type="checkbox" class="sty-inp" id="id_is_primary_val" />
                                                </span>&nbsp;Make this Member as a Primary Member
                                            </small>
                                            <small id="id_is_primary_Error" class="error-message"></small>
                                            </div>
                                        </div>

                                        <div class="hr-container">
                                            <hr class="hr-text text-center" style="font-size: 27px; color: #2b96f1" data-content="Nominee Details"/>
                                        </div>
                    `

                    // Append nominee details
                    if (item.nominee_Details.length > 0) {
                        item.nominee_Details.forEach(function (nominee) {
                            htmlContent +=
                            `
                            <div id="newNominee">
                            <div class="row ps-4 pe-4 abcd" id="cloneNominee_${item.member_id}">
                            <h2 id="heading" class="mb-3 text-center">Nominee: ${nominee.nominee_name}</h2>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                                <input type="text" class="w-100 sty-inp" id="id_nominee_name${nomineeIdIncCount}" value="${nominee.nominee_name}" />
                                                <label for="id_nominee_name${nomineeIdIncCount}" class="sty-label">Nominee Name</label>
                                                <small id="id_nominee_name${nomineeIdIncCount}_Error" class="error-message"></small>
                                                </div>
                                        </div>

                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="date" class="w-100 sty-inp form-control" id="id_nomination_date${nomineeIdIncCount}" />
                                            <label for="" class="sty-label">Date of Nomination</label>
                                            <small id="id_nomination_date${nomineeIdIncCount}_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input class="w-100 sty-inp form-control" type="text" name="" id="id_nominee_relation" />
                                            <label for="" class="sty-label">Relation with Nominator</label>
                                            <small id="id_nominee_relation_Error" class="error-message"></small>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="text" class="w-100 sty-inp form-control percentage-input"
                                                id="id_naminee_sharein" />
                                            <label for="" class="sty-label">Nominee Sharein %</label>
                                            <small id="id_naminee_sharein_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="date" class="w-100 sty-inp" id="id_nominee_dob" />
                                            <label for="" class="sty-label">Nominee DOB</label>
                                            <small id="id_nominee_dob_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="number" class="w-100 sty-inp" id="id_nominee_aadhar_no" />
                                            <label for="" class="sty-label">Nominee Aadhaar No</label>
                                            <small id="id_nominee_aadhar_no_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="text" class="w-100 sty-inp" id="id_nominee_pan_no" />
                                            <label for="" class="sty-label">Nominee PAN No</label>
                                            <small id="id_nominee_pan_no_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="text" class="w-100 sty-inp" id="id_nominee_email" />
                                            <label for="id_nominee_email" class="sty-label">Nominee Email</label>
                                            <small id="id_nominee_email_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <textarea class="w-100 sty-inp form-control" name="" id="id_nominee_address" cols="30"
                                                rows="1"></textarea>
                                            <label for="" class="sty-label">Nominee Permanent Address</label>
                                            <small id="id_nominee_address_Error" class="error-message"></small>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                                <select class="w-100 sty-inp form-control" name=""
                                                    id="id_nominee_state">
                                                    <option value="#">Select your State</option>
                                                    <option value="Andhra Pradesh">
                                                        Andhra Pradesh
                                                    </option>
                                                    <option value="Arunachal Pradesh">
                                                        Arunachal Pradesh
                                                    </option>
                                                    <option value="Assam">Assam</option>
                                                    <option value="Bihar">Bihar</option>
                                                    <option value="Chhattisgarh">
                                                        Chhattisgarh
                                                    </option>
                                                    <option value="Goa">Goa</option>
                                                    <option value="Gujarat">Gujarat</option>
                                                    <option value="Haryana">Haryana</option>
                                                    <option value="Himachal Pradesh">
                                                        Himachal Pradesh
                                                    </option>
                                                    <option value="Jammu and Kashmir">
                                                        Jammu and Kashmir
                                                    </option>
                                                    <option value="Jharkhand">Jharkhand</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Madhya Pradesh">
                                                        Madhya Pradesh
                                                    </option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Manipur">Manipur</option>
                                                    <option value="Meghalaya">Meghalaya</option>
                                                    <option value="Mizoram">Mizoram</option>
                                                    <option value="Nagaland">Nagaland</option>
                                                    <option value="Odisha">Odisha</option>
                                                    <option value="Punjab">Punjab</option>
                                                    <option value="Rajasthan">Rajasthan</option>
                                                    <option value="Sikkim">Sikkim</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Tripura">Tripura</option>
                                                    <option value="Uttar Pradesh">
                                                        Uttar Pradesh
                                                    </option>
                                                    <option value="Uttarakhand">Uttarakhand</option>
                                                    <option value="West Bengal">West Bengal</option>
                                                    <option value="Andaman and Nicobar ">
                                                        Andaman and Nicobar
                                                    </option>
                                                    <option value="Islands">Islands</option>
                                                    <option value="Dadra and Nagar Haveli">
                                                        Dadra and Nagar Haveli
                                                    </option>
                                                    <option value="Daman and Diu">
                                                        Daman and Diu
                                                    </option>
                                                    <option value="Delhi">Delhi</option>
                                                    <option value="Ladakh">Ladakh</option>
                                                    <option value="Lakshadweep">Lakshadweep</option>
                                                    <option value="Puducherry">Puducherry</option>
                                                </select>
                                                <label for="id_nominee_state" class="sty-label">State</label>
                                                <small id="id_nominee_state_Error" class="error-message"></small>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="number" class="w-100 sty-inp" id="id_nominee_pin_code" />
                                            <label for="" class="sty-label">Pin Code</label>
                                            <small id="id_nominee_pin_code_Error" class="error-message"></small>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="number" class="w-100 sty-inp form-control" id="id_nominee_contact_number" />
                                            <label for="" class="sty-label">Nominee Contact No.</label>
                                            <small id="id_nominee_contact_number_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-3">
                                            <div class="w-100 sty-input-wrapper">
                                            <input type="number" class="w-100 sty-inp" id="id_nominee_emergency_contact" />
                                            <label for="" class="sty-label">Emergency Contact No.</label>
                                            <small id="id_nominee_emergency_contact_Error" class="error-message"></small>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                                                              
                            `
                            nomineeIdIncCount = nomineeIdIncCount + 1;                            
                        });
                    }
                    htmlContent +=
                        `        
                        <div class="row ps-4 pe-4 abcd" id="cloneNominee_${item.member_id}_cloned">

                        </div>
                        <div class="btn-grp d-flex justify-content pb-3 ps-4 pe-4" style="justify-content: space-between;">
                            <button type="button" id="newNominee_${item.member_id}" class="btn btn-primary" onclick="addNomineeOnEditForm('cloneNominee_${item.member_id}')"> Add Nominee</button>
                        </div>                 
                        </form>
                        </div>
                        </div>
                        </div>
                        `
                    memberIdIncCount = memberIdIncCount + 1;
                    // TO BE CONTINUE WITH OWNERSHIP
                    flat_and_ownership_ids.push({
                        flat: "#id_wing_flat" + memberIdIncCount, 
                        ownership: "#id_member_ownership" + memberIdIncCount, 
                    });
                    
                    
                });
                console.log("flat_and_ownership_ids=============", flat_and_ownership_ids)
                htmlContent += `
                    <div class="btn-grp d-flex justify-content pb-3 ps-4 pe-4" style="justify-content: space-between;">
                        <div class="two-btn">
                            <button type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" onclick="save_and_edit_member()">Update</button>
                        </div>
                    </div>
                `

                sharedContent =
                `
                <form action="">
                    <div class="row pt-3 ps-4 pe-4">
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <!-- <input type="number" class="w-100 sty-inp" /> -->
                                <select name="" id="" class="w-100 sty-inp form-control">
                                    <option value="#">Select your Wing & Flat No.</option>
                                    <option value="#">A-Wing(101)</option>
                                    <option value="#">B-Wing(301)</option>
                                    <option value="#">C-Wing(301)</option>
                                </select>
                                <label for="" class="sty-label">Wing & Flat No.</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" value="${sharesData[0]?.folio_number || ''}" />
                                <label for="" class="sty-label">Folio Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="date" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Share Issue Date</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Application Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Serial No. of Certificate</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Allotment Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Share No. from</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Share No. To</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="date" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Share Transfer Date</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Total Amount Received</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="date" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Total Amount Received On</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Transfer from Folio Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Transfer to Folio Number</label>
                            </div>
                        </div>
                    </div>
                    <hr>


                    <div class="two-btn float-end pb-3 pe-4">
                        <button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </form>
                `;
                homeLoanContent = 
                `
                <form action="">
                    <div class="row pt-3 ps-4 pe-4">
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" value="${homeLoanData[0]?.bank_loan_name || '-'}" />
                                <label for="" class="sty-label">Hypothication Bank Name</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Object of Loan</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="date" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Loan Issue Date</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Loan Value</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Account Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Installment</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <!-- <input type="text" class="w-100 sty-inp" /> -->
                                <select name="" class="w-100 form-control sty-inp" id="selectStatus">
                                    <option value="#">Select Status</option>
                                    <option value="option1">Active</option>
                                    <option value="option2">Closed</option>
                                </select>
                                <label for="" class="sty-label">Loan Status</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3" id="attachNOC" style="display: none;">
                            <div class="w-100 sty-input-wrapper">
                                <input type="file" class="w-100 sty-inp form-control" />
                                <label for="" class="sty-label">Attach NOC</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Remarks</label>
                            </div>
                        </div>
                    </div>
                    <hr>


                    <div class="two-btn float-end pb-3 pe-4">
                        <button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </form>
                `;

                gstContent = 
                `
                <form action="">
                    <div class="row pt-3 ps-4 pe-4">
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" value="${gstData[0]?.gst_number || '-'}" />
                                <label for="" class="sty-label">GST Number</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Billing State</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="text" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Billing Name</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <textarea class="w-100 sty-inp form-control" name="" id="" cols="30"
                                    rows="1"></textarea>
                                <label for="" class="sty-label">Billing Address</label>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <div class="w-100 sty-input-wrapper">
                                <input type="number" class="w-100 sty-inp" />
                                <label for="" class="sty-label">Contact Number</label>
                            </div>
                        </div>
                    </div>
                    <hr>

                    <div class="two-btn float-end pb-3 pe-4">
                        <button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </form>
                `;

                if (vehicleData && vehicleData.length > 0) {
                    vehicleData.forEach(function (item) {
                        vehicleContent += 
                        `
                        <form action="">
                            <h1>===============VEHICLE=========</h1>
                            <div id="newVehicle">                                    
                                <div class="row mt-3" id="cloneVehicle">
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="text" class="w-100 sty-inp" id="id_parking_lot0" value="${vehicleData[0]?.parking_lot || ''}" />
                                    <label for="id_parking_lot0" class="sty-label">Parking Lot</label>
                                    <small id="Error_id_parking_lot0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="text" class="w-100 sty-inp" id="id_vehicle_type0" />
                                    <label for="id_vehicle_type0" class="sty-label">Vehicle Type</label>
                                    <small id="Error_id_vehicle_type0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="text" class="w-100 sty-inp" id="id_vehicle_number0" />
                                    <label for="id_vehicle_number0" class="sty-label">Vehicle Number</label>
                                    <small id="Error_id_vehicle_number0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="text" class="w-100 sty-inp" id="id_vehicle_brand0" />
                                    <label for="id_vehicle_brand0" class="sty-label">Brand & Model</label>
                                    <small id="Error_id_vehicle_brand0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="file" class="w-100 sty-inp form-control" id="id_rc_copy0" />
                                    <label for="id_rc_copy0" class="sty-label">RC Copy</label>
                                    <small id="Error_id_rc_copy0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <input type="text" class="w-100 sty-inp form-control" id="id_sticker_number0" />
                                    <label for="id_sticker_number0" class="sty-label">Sticker Number</label>
                                    <small id="Error_id_sticker_number0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3">
                                    <div class="w-100 sty-input-wrapper">
                                    <select class="w-100 sty-inp form-control" name="" id="id_select_charge0"
                                        onchange="selectChange(this.id, ('related_' + this.id), ('vehicle_' + this.id))">
                                        <option value="#" selected>YES / NO</option>
                                        <option id="optN0" value="no">NO</option>
                                        <option id="optY0" value="yes">YES</option>
                                    </select>
                                    <!-- <input type="text" class="w-100 sty-inp"> -->
                                    <label for="id_select_charge0" class="sty-label">Vehicle Chargeable</label>
                                    <small id="Error_id_select_charge0" class="error-message"></small>
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-3" id="addCharge0">
                                    <div class="w-100 sty-input-wrapper" id="vehicle_id_select_charge0">
                                </div>
                                </div>
                                <hr />
                            </div>
                            <div class="row" id="newVehicleContainer"></div>
                            </div>
                        </form> 

                        `;
                    });
                    vehicleContent += 
                    `
                        <input type="button" name="" class="add-mem-btn float-start" id="addVehicles" value="Add Vehicle" onclick="addVehicle()" />
                    `;
                }else{
                    vehicleContent += 
                    `
                        <input type="button" name="" class="add-mem-btn float-start" id="addVehicles" value="Add Vehicle" onclick="addVehicle()" />
                    `;
                }
                
                $('#memberEditForm').html(htmlContent);
                $('#sharedmemberEditForm').html(sharedContent);
                $('#homeloanEditForm').html(homeLoanContent);
                $('#gstEditform').html(gstContent);
                $('#vehicleEditForm').html(vehicleContent);
            }
        
        },
        error: function (xhr) {
            alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        }
    });
}



function save_and_edit_member() {
    clickedButton = this;
    let isValid = true;
    let ajax_ownsership = false;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const max100NumberRegex = /^(?:[1-9]\d{2,}|1000+)$/;
    let numberregex = /^([1-9]\d{0,1}|100)$/;
    
    let required_fields = {
        // members ids
        "id_wing_flat": "Pls select the flat number!",
        "id_member_name": "Member name is required!",
        "id_member_ownership": "Member ownership is required!",
        // "id_member_position": "Member position is required!",
        // "id_member_dob": "Date of birth is required!",
        // "id_member_pan_number": "Member pan number is required!",
        // "id_member_aadhar_no": "Member aadhar number is required!",
        // "id_member_address": "Address is required!",
        // "id_member_state": "State is required!",
        // "id_member_pin_code": "Pin code is required",
        // "id_member_email": "Email is reqired!",
        // "id_member_contact": "Contact number is required!",
        // "id_member_emergency_contact": "Emergency contact no. is required!",
        // "id_member_occupation": "Occupation is required!",
        // "id_date_of_admission": "Date of admission is required!",
        // "id_member_flat_status": "Flat status is required!",
        // "id_date_of_entrance_fees": "Date of entrance fees is required!",
        // "id_date_of_cessation": "Date of admission is required!",
        // "id_cessation_reason": "Cessation reason is reqired!",
    };

    let memberIds = {
        // members ids
        "id_wing_flat": "Pls select the flat number!",
        "id_member_name": "Member name is required!",
        "id_member_ownership": "Member ownership is required!",
        // "id_member_position": "Member position is required!",
        // "id_member_dob": "Date of birth is required!",
        // "id_member_pan_number": "Member pan number is required!",
        // "id_member_aadhar_no": "Member aadhar number is required!",
        // "id_member_address": "Address is required!",
        // "id_member_state": "State is required!",
        // "id_member_pin_code": "Pin code is required",
        // "id_member_email": "Email is reqired!",
        // "id_member_contact": "Contact number is required!",
        // "id_member_emergency_contact": "Emergency contact no. is required!",
        // "id_member_occupation": "Occupation is required!",
        // "id_date_of_admission": "Date of admission is required!",
        // "id_member_flat_status": "Flat status is required!",
        // "id_date_of_entrance_fees": "Date of entrance fees is required!",
        // "id_date_of_cessation": "Date of admission is required!",
        // "id_cessation_reason": "Cessation reason is reqired!",
    };


    let get_nominee_detail = {
        // nominee ids
        "id_nominee_name": "Nominee name is required!",
        // "id_nomination_date": "Date of nomination is required!",
        // "id_nominee_relation": "Nominee relation is required!",
        // "id_naminee_sharein": "Nominee sharein is required!",
        // "id_nominee_dob": "Nominee date of birth is required!",
        // "id_nominee_aadhar_no": "Nominee aadhar no. is required!",
        // "id_nominee_pan_no": "Nominee pan no. is required!",
        // "id_nominee_email": "Nominee email is required!",
        // "id_nominee_address": "Nominee address is required!",
        // "id_nominee_state": "Nominee state is required!",
        // "id_nominee_pin_code": "Nominee pin code is required!",
        // "id_nominee_contact_number": "Nominee contact number is required!",
        // "id_nominee_emergency_contact": "Nominee emergency contact is required!",
    };

    

    let email_fields = {
        // "id_member_email": "Invalid Email",
        // "id_nominee_email": "Invalid Email"
    }

    // ADD INCREMENTED NOMINEE IN required_fields
    for (let key in get_nominee_detail) {
        Array.from(document.querySelectorAll('[id^="' + key + '"]'))
            .filter(element => !element.id.includes('_Error'))
            .map(element => {
                required_fields[element.id] = get_nominee_detail[key];
                return element;
            });
    }

    // ADD INCREMENTED MEMBER IN required_fields
    for (let key in memberIds) {
        Array.from(document.querySelectorAll('[id^="' + key + '"]'))
            .filter(element => !element.id.includes('_Error'))
            .map(element => {
                required_fields[element.id] = memberIds[key];
                return element;
            });
    }



    function validateForm(step) {
        for (let key in required_fields) {
            let inputValue = $("#" + key).val();
            let value = (inputValue !== null && inputValue !== undefined) ? inputValue.trim() : "";
            console.log("val============", value)

            if ((value === "") || (
                (key.startsWith("id_nominee_state")) && (value == "#") ||
                (key == "id_member_position") && (value == "#") ||
                (key == "id_member_state") && (value == "#")
            )) {
                isValid = false;
                $("#" + key).css("border-color", "red");
                $("#" + key + "_Error").text(required_fields[key]);
            } else if (value && ((key === "id_member_email") && !emailRegex.test(value) || (key.startsWith("id_nominee_email")) && !emailRegex.test(value))) {
                isValid = false;
                $("#" + key).css("border-color", "red");
                $("#" + key + "_Error").text("Invalid Email!");
            } else if (value && ((key === "id_member_ownership") && !numberregex.test(value))) {
                // console.log("NUMBER===============")
                isValid = false;
                $("#" + key).css("border-color", "red");
                $("#" + key + "_Error").text("Percentage shoule be below 100");
            } else {
                if(key.startsWith("id_member_ownership") || key.startsWith("id_wing_flat")){
                    data = $("#" + key).val();
                    console.log("data======================", data)
                }
                $("#" + key).css("border-color", ""); // Reset to default
                $("#" + key + "_Error").text(""); // Clear the error message
            }
        }

        for (let key in email_fields) {
            let value = $("#" + key).val().trim();
            if (value && (!emailRegex.test(value))) {
                isValid = false;
                $("#" + key).css("border-color", "red");
                $("#" + key + "_Error").text("Invalid Email");
            } else {
                $("#" + key).css("border-color", ""); // Reset to default
                $("#" + key + "_Error").text(""); // Clear the error message
            }
        }

        // OWNERSHIP VALIDATION
        // let formData = new FormData();
        // formData.append('get_ownership_ajax', true);
        // formData.append('ajax_get_primary', false);
        // formData.append('member_ownership', $('#id_member_ownership').val());
        // formData.append('wing_flat_number', $('#id_wing_flat').val());

        // let headers = {
        //     "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
        // };

        // $.ajax({
        //     url: '/member-master/',
        //     method: 'POST',
        //     data: formData,
        //     headers: headers,
        //     processData: false,
        //     contentType: false,
        //     async: false,
        //     success: function (response) {
        //         console.log("Success=======Success");
        //         if (response.ownership) {
        //             $("#id_member_ownership").css("border-color", "red");
        //             $("#id_member_ownership_Error").text(response.ownership);
        //             ajax_ownsership = true;
        //             isValid = false;
        //             console.log("in if=====================in if")
        //         } else {
        //             $("#id_member_ownership").css("border-color", "");
        //             $("#id_member_ownership_Error").text("");
        //             console.log("in else=====================in else")

        //             // tryna fix it might create problem later
        //             // stopNext = false
        //         }
        //     },
        //     error: function (xhr) {
        //         console.log("Something went wrong! " + xhr.status + " " + xhr.statusText);
        //     }
        // });

        return isValid;
    }


    // if (ajax_ownsership){}
    if (!validateForm(1)) {
        console.log("INVALID========================");
        console.log("ajax_ownsership=========", ajax_ownsership)
        toastr.error("Please correct all error to proceed!!");
        stopNext = false
    } else {
        console.log("VALID========================")
        stopNext = true;
        const nominee_form_count = Array.from(document.querySelectorAll('[id^="id_nominee_name"]'))
            .filter(element => !element.id.endsWith('_Error')).length;

        for (var i = 0; i < nominee_form_count + 1; i++) {
            let count = i
            if (count === 0) {
                count = "";
            }
            console.log("number is===========", count)
            nomineeData.push({
                ["nominee_name"]: $('#id_nominee_name' + count).val(),
                ["date_of_nomination"]: $('#id_nomination_date' + count).val() === "" ? null : $('#id_nomination_date' + count).val(),
                ["relation_with_nominee"]: $('#id_nominee_relation' + count).val(),
                ["nominee_sharein_percent"]: $('#id_naminee_sharein' + count).val() === "" ? 0 : $('#id_naminee_sharein' + count).val(),
                ["nominee_dob"]: $('#id_nominee_dob' + count).val() === "" ? null : $('#id_nominee_dob' + count).val(),
                ["nominee_aadhar_no"]: $('#id_nominee_aadhar_no' + count).val(),
                ["nominee_pan_no"]: $('#id_nominee_pan_no' + count).val(),
                ["nominee_email"]: $('#id_nominee_email' + count).val(),
                ["nominee_address"]: $('#id_nominee_address' + count).val(),
                ["nominee_state"]: $('#id_nominee_state' + count).val(),
                ["nominee_pin_code"]: $('#id_nominee_pin_code' + count).val(),
                ["nominee_contact"]: $('#id_nominee_contact_number' + count).val(),
                ["nominee_emergency_contact"]: $('#id_nominee_emergency_contact' + count).val(),
            });
        }
        memberData.push({
            ["member_name"]: $('#id_member_name').val(),
            ["ownership_percent"]: $('#id_member_ownership').val(),
            ["member_position"]: $('#id_member_position').val(),
            ["member_dob"]: $('#id_member_dob').val() === "" ? null : $('#id_member_dob').val(),
            ["member_pan_no"]: $('#id_member_pan_number').val(),
            ["member_aadhar_no"]: $('#id_member_aadhar_no').val(),
            ["member_address"]: $('#id_member_address').val(),
            ["member_state"]: $('#id_member_state').val(),
            ["member_pin_code"]: $('#id_member_pin_code').val(),
            ["member_email"]: $('#id_member_email').val(),
            ["member_contact"]: $('#id_member_contact').val(),
            ["member_emergency_contact"]: $('#id_member_emergency_contact').val(),
            ["member_occupation"]: $('#id_member_occupation').val(),
            ["member_is_primary"]: $('#id_is_primary_val').prop('checked')

        });

        let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let headers = {
            "X-CSRFToken": csrfToken
        };
        let formData = new FormData();
        let memberDataJson = JSON.stringify(memberData);
        let nomineeDataJson = JSON.stringify(nomineeData);
        formData.append('form_name', 'member_form_creation');
        formData.append('memberData', memberDataJson);
        formData.append('nomineeData', nomineeDataJson);
        formData.append('member_ownership', $('#id_member_ownership').val());
        formData.append('wing_flat_number', $('#id_wing_flat').val());


        $.ajax({
            url: '/member-master-creation/',
            method: 'POST',
            data: formData,
            headers: headers,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Success");
                toastr.success(response.message, "Member Details Added!");
                // $("#msform")[0].reset();
                if ($(clickedButton).is('#save_and_add_member')) {
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }

            },
            error: function (xhr) {
                alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
            }
        });
    }
}


// Add member details
function addMemberDetails(id){
    let formData = new FormData();
    formData.append('member_id', id);
    formData.append('form_name', 'add_member_from_modal');

    $.ajax({
        url: '/member-master-creation/',
        method: 'POST',
        data: formData,
        headers: {
            'X-CSRFToken': csrftoken
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Success");
        },
        error: function (xhr) {
            alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        }
    });
}



function flatHistoryDetails(id){
    let formData = new FormData();
    formData.append('flat_id', id);

    $.ajax({
        url: '/member-edit-view/',
        method: 'POST',
        data: formData,
        headers: {
            'X-CSRFToken': csrftoken
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Success");
            // if (response.all_member_json) {
            //     let memberData = JSON.parse(response.all_member_json)
            //     let sharesData = JSON.parse(response.shares_details)
            //     let homeLoanData = JSON.parse(response.home_loan_obj)
            //     let gstData = JSON.parse(response.gst_obj)
            //     let vehicleData = JSON.parse(response.vehicle_obj)
            //     let htmlContent = '';
            //     let sharedContent = '';
            //     let homeLoanContent = '';
            //     let gstContent = '';
            //     let vehicleContent = '';
            //     memberData.forEach(function (item) {
            //         // Append member details
            //         htmlContent +=
            //             `
            //             <div class="accordion-item">
            //                 <h2 class="accordion-header">
            //                     <button id="heading" class="accordion-button" type="button"
            //                         data-bs-toggle="collapse" data-bs-target="#collapse_edit${item.member_id}" aria-expanded="true" aria-controls="collapse_edit${item.member_id}"
            //                         aria-controls="collapseOne">
            //                         ${item.member_name}
            //                     </button>
            //                 </h2>
            //                 <div id="collapseOne" class="accordion-collapse collapse show"
            //                     data-bs-parent="#member-edit-accordian">
            //                     <div class="accordion-body">
            //                         <form action="">
            //                             <div class="row mt-3 ps-4 pe-4" style="text-align: left">
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <select name="" id="" class="w-100 form-control sty-inp">
            //                                             <option value="#">
            //                                                 Select your Wing & Flat No.
            //                                             </option>
            //                                             <option value="#">A-Wing(101)</option>
            //                                             <option value="#">B-Wing(201)</option>
            //                                             <option value="#">C-Wing(301)</option>
            //                                         </select>
            //                                         <label for="" class="sty-label">Wing & Flat No.</label>
            //                                     </div>
            //                                 </div>

            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="text" class="w-100 sty-inp" value=${item.member_name} />
            //                                         <label for="" class="sty-label">Member's Name</label>
            //                                     </div>
            //                                 </div>

            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="text" class="w-100 sty-inp percentage-input" />
            //                                         <label for="" class="sty-label">Ownership %</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <select name="" class="w-100 sty-inp form-control" id="">
            //                                             <option value="#">Select Position</option>
            //                                             <option value="associate-member">
            //                                                 Associate Member
            //                                             </option>
            //                                             <option value="chairman">Chairman</option>
            //                                             <option value="secretary">Secretary</option>
            //                                             <option value="treasurer">Treasurer</option>
            //                                         </select>
            //                                         <label for="" class="sty-label">Position</label>
            //                                     </div>
            //                                 </div>

            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="date" class="w-100 sty-inp form-control" />
            //                                         <label for="" class="sty-label">Member DOB</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="text" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Member PAN No</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="number" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Member Aadhaar No</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <textarea class="w-100 sty-inp form-control" name="" id=""
            //                                             cols="30" rows="1"></textarea>
            //                                         <label for="" class="sty-label">Member Permanent
            //                                             Address</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <select class="w-100 sty-inp form-control" name="" id="">
            //                                             <option value="#">Select your State</option>
            //                                             <option value="Andhra Pradesh">
            //                                                 Andhra Pradesh
            //                                             </option>
            //                                             <option value="Arunachal Pradesh">
            //                                                 Arunachal Pradesh
            //                                             </option>
            //                                             <option value="Assam">Assam</option>
            //                                             <option value="Bihar">Bihar</option>
            //                                             <option value="Chhattisgarh">Chhattisgarh</option>
            //                                             <option value="Goa">Goa</option>
            //                                             <option value="Gujarat">Gujarat</option>
            //                                             <option value="Haryana">Haryana</option>
            //                                             <option value="Himachal Pradesh">
            //                                                 Himachal Pradesh
            //                                             </option>
            //                                             <option value="Jammu and Kashmir">
            //                                                 Jammu and Kashmir
            //                                             </option>
            //                                             <option value="Jharkhand">Jharkhand</option>
            //                                             <option value="Karnataka">Karnataka</option>
            //                                             <option value="Kerala">Kerala</option>
            //                                             <option value="Madhya Pradesh">
            //                                                 Madhya Pradesh
            //                                             </option>
            //                                             <option value="Maharashtra">Maharashtra</option>
            //                                             <option value="Manipur">Manipur</option>
            //                                             <option value="Meghalaya">Meghalaya</option>
            //                                             <option value="Mizoram">Mizoram</option>
            //                                             <option value="Nagaland">Nagaland</option>
            //                                             <option value="Odisha">Odisha</option>
            //                                             <option value="Punjab">Punjab</option>
            //                                             <option value="Rajasthan">Rajasthan</option>
            //                                             <option value="Sikkim">Sikkim</option>
            //                                             <option value="Tamil Nadu">Tamil Nadu</option>
            //                                             <option value="Telangana">Telangana</option>
            //                                             <option value="Tripura">Tripura</option>
            //                                             <option value="Uttar Pradesh">
            //                                                 Uttar Pradesh
            //                                             </option>
            //                                             <option value="Uttarakhand">Uttarakhand</option>
            //                                             <option value="West Bengal">West Bengal</option>
            //                                             <option value="Andaman and Nicobar ">
            //                                                 Andaman and Nicobar
            //                                             </option>
            //                                             <option value="Islands">Islands</option>
            //                                             <option value="Dadra and Nagar Haveli">
            //                                                 Dadra and Nagar Haveli
            //                                             </option>
            //                                             <option value="Daman and Diu">
            //                                                 Daman and Diu
            //                                             </option>
            //                                             <option value="Delhi">Delhi</option>
            //                                             <option value="Ladakh">Ladakh</option>
            //                                             <option value="Lakshadweep">Lakshadweep</option>
            //                                             <option value="Puducherry">Puducherry</option>
            //                                         </select>
            //                                         <label for="" class="sty-label">State</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="number" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Pin Code</label>
            //                                     </div>
            //                                 </div>

            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="email" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Member Email</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="number" class="w-100 sty-inp form-control" />
            //                                         <label for="" class="sty-label">Member Contact No.</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="number" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Emergency Contact
            //                                             No.</label>
            //                                     </div>
            //                                 </div>
            //                                 <div class="col-lg-4 mb-3">
            //                                     <div class="w-100 sty-input-wrapper">
            //                                         <input type="text" class="w-100 sty-inp" />
            //                                         <label for="" class="sty-label">Occupation</label>
            //                                     </div>
            //                                 </div>
            //                             </div>

            //                             <hr>
            //         `

            //         // Append nominee details
            //         if (item.nominee_Details.length > 0) {
            //             item.nominee_Details.forEach(function (nominee) {
            //                 htmlContent +=
            //                 `
            //                 <div id="newNominee">
            //                     <div class="row ps-4 pe-4 abcd" id="cloneNominee">
            //                     <h2 id="heading" class="mb-3 text-center">Nominee: ${nominee.nominee_name}</h2>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="text" class="w-100 sty-inp" id="nomName0" value=${nominee.nominee_name} />
            //                                     <label for="" class="sty-label">Nominee Name</label>
            //                                 </div>
            //                             </div>

            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="date" class="w-100 sty-inp form-control"
            //                                         id="nomDate0" />
            //                                     <label for="" class="sty-label">Date of
            //                                         Nomination</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input class="w-100 sty-inp form-control" type="text"
            //                                         name="" id="nomRelation0" />
            //                                     <label for="" class="sty-label">Relation with
            //                                         Nominator</label>
            //                                 </div>
            //                             </div>

            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="text"
            //                                         class="w-100 sty-inp form-control percentage-input"
            //                                         id="nomShares0" />
            //                                     <label for="" class="sty-label">Nominee Sharein
            //                                         %</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="date" class="w-100 sty-inp" id="nomDOB0" />
            //                                     <label for="" class="sty-label">Nominee DOB</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="number" class="w-100 sty-inp"
            //                                         id="nomAadhaar0" />
            //                                     <label for="" class="sty-label">Nominee Aadhaar
            //                                         No</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="text" class="w-100 sty-inp" id="nomPan0" />
            //                                     <label for="" class="sty-label">Nominee PAN No</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="email" class="w-100 sty-inp"
            //                                         id="nomeEmail0" />
            //                                     <label for="" class="sty-label">Nominee Email</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <textarea class="w-100 sty-inp form-control" name=""
            //                                         id="nomAddress0" cols="30" rows="1"></textarea>
            //                                     <label for="" class="sty-label">Nominee Permanent
            //                                         Address</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <select class="w-100 sty-inp form-control" name=""
            //                                         id="nomState0">
            //                                         <option value="#">Select your State</option>
            //                                         <option value="Andhra Pradesh">
            //                                             Andhra Pradesh
            //                                         </option>
            //                                         <option value="Arunachal Pradesh">
            //                                             Arunachal Pradesh
            //                                         </option>
            //                                         <option value="Assam">Assam</option>
            //                                         <option value="Bihar">Bihar</option>
            //                                         <option value="Chhattisgarh">
            //                                             Chhattisgarh
            //                                         </option>
            //                                         <option value="Goa">Goa</option>
            //                                         <option value="Gujarat">Gujarat</option>
            //                                         <option value="Haryana">Haryana</option>
            //                                         <option value="Himachal Pradesh">
            //                                             Himachal Pradesh
            //                                         </option>
            //                                         <option value="Jammu and Kashmir">
            //                                             Jammu and Kashmir
            //                                         </option>
            //                                         <option value="Jharkhand">Jharkhand</option>
            //                                         <option value="Karnataka">Karnataka</option>
            //                                         <option value="Kerala">Kerala</option>
            //                                         <option value="Madhya Pradesh">
            //                                             Madhya Pradesh
            //                                         </option>
            //                                         <option value="Maharashtra">Maharashtra</option>
            //                                         <option value="Manipur">Manipur</option>
            //                                         <option value="Meghalaya">Meghalaya</option>
            //                                         <option value="Mizoram">Mizoram</option>
            //                                         <option value="Nagaland">Nagaland</option>
            //                                         <option value="Odisha">Odisha</option>
            //                                         <option value="Punjab">Punjab</option>
            //                                         <option value="Rajasthan">Rajasthan</option>
            //                                         <option value="Sikkim">Sikkim</option>
            //                                         <option value="Tamil Nadu">Tamil Nadu</option>
            //                                         <option value="Telangana">Telangana</option>
            //                                         <option value="Tripura">Tripura</option>
            //                                         <option value="Uttar Pradesh">
            //                                             Uttar Pradesh
            //                                         </option>
            //                                         <option value="Uttarakhand">Uttarakhand</option>
            //                                         <option value="West Bengal">West Bengal</option>
            //                                         <option value="Andaman and Nicobar ">
            //                                             Andaman and Nicobar
            //                                         </option>
            //                                         <option value="Islands">Islands</option>
            //                                         <option value="Dadra and Nagar Haveli">
            //                                             Dadra and Nagar Haveli
            //                                         </option>
            //                                         <option value="Daman and Diu">
            //                                             Daman and Diu
            //                                         </option>
            //                                         <option value="Delhi">Delhi</option>
            //                                         <option value="Ladakh">Ladakh</option>
            //                                         <option value="Lakshadweep">Lakshadweep</option>
            //                                         <option value="Puducherry">Puducherry</option>
            //                                     </select>
            //                                     <label for="" class="sty-label">State</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="number" class="w-100 sty-inp"
            //                                         id="nomPin0" />
            //                                     <label for="" class="sty-label">Pin Code</label>
            //                                 </div>
            //                             </div>

            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="number" class="w-100 sty-inp form-control"
            //                                         id="nomContact0" />
            //                                     <label for="" class="sty-label">Nominee Contact
            //                                         No.</label>
            //                                 </div>
            //                             </div>
            //                             <div class="col-lg-4 mb-3">
            //                                 <div class="w-100 sty-input-wrapper">
            //                                     <input type="number" class="w-100 sty-inp"
            //                                         id="nomEmerContact0" />
            //                                     <label for="" class="sty-label">Emergency Contact
            //                                         No.</label>
            //                                 </div>
            //                             </div>
            //                             <hr />
            //                         </div>
            //                     </div>                                                
            //                 `
            //             });
            //             htmlContent +=
            //             `
            //             <div class="btn-grp d-flex justify-content pb-3 ps-4 pe-4" style="justify-content: space-between;">
            //                 <button type="button" name="" class="btn btn-primary" onclick="addNominee()"> Add Nominee</button>
            //                 <div class="two-btn">
            //                     <button type="button" class="btn btn-secondary"
            //                         data-bs-dismiss="modal">Close</button>
            //                     <button type="submit" class="btn btn-primary">Update</button>
            //                 </div>
            //             </div>
            //             `;
            //         }
            //         htmlContent +=
            //             `
            //                 </form>
            //                 </div>
            //                 </div>
            //                 </div>
            //             `
            //     });
            //     sharedContent =
            //     `
            //     <form action="">
            //         <div class="row pt-3 ps-4 pe-4">
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <!-- <input type="number" class="w-100 sty-inp" /> -->
            //                     <select name="" id="" class="w-100 sty-inp form-control">
            //                         <option value="#">Select your Wing & Flat No.</option>
            //                         <option value="#">A-Wing(101)</option>
            //                         <option value="#">B-Wing(301)</option>
            //                         <option value="#">C-Wing(301)</option>
            //                     </select>
            //                     <label for="" class="sty-label">Wing & Flat No.</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" value="${sharesData[0]?.folio_number || ''}" />
            //                     <label for="" class="sty-label">Folio Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="date" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Share Issue Date</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Application Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Serial No. of Certificate</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Allotment Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Share No. from</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Share No. To</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="date" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Share Transfer Date</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Total Amount Received</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="date" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Total Amount Received On</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Transfer from Folio Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Transfer to Folio Number</label>
            //                 </div>
            //             </div>
            //         </div>
            //         <hr>


            //         <div class="two-btn float-end pb-3 pe-4">
            //             <button type="button" class="btn btn-secondary"
            //                 data-bs-dismiss="modal">Close</button>
            //             <button type="submit" class="btn btn-primary">Update</button>
            //         </div>
            //     </form>
            //     `;
            //     homeLoanContent = 
            //     `
            //     <form action="">
            //         <div class="row pt-3 ps-4 pe-4">
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" value="${homeLoanData[0]?.bank_loan_name || '-'}" />
            //                     <label for="" class="sty-label">Hypothication Bank Name</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Object of Loan</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="date" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Loan Issue Date</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Loan Value</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Account Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Installment</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <!-- <input type="text" class="w-100 sty-inp" /> -->
            //                     <select name="" class="w-100 form-control sty-inp" id="selectStatus">
            //                         <option value="#">Select Status</option>
            //                         <option value="option1">Active</option>
            //                         <option value="option2">Closed</option>
            //                     </select>
            //                     <label for="" class="sty-label">Loan Status</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3" id="attachNOC" style="display: none;">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="file" class="w-100 sty-inp form-control" />
            //                     <label for="" class="sty-label">Attach NOC</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Remarks</label>
            //                 </div>
            //             </div>
            //         </div>
            //         <hr>


            //         <div class="two-btn float-end pb-3 pe-4">
            //             <button type="button" class="btn btn-secondary"
            //                 data-bs-dismiss="modal">Close</button>
            //             <button type="submit" class="btn btn-primary">Update</button>
            //         </div>
            //     </form>
            //     `;

            //     gstContent = 
            //     `
            //     <form action="">
            //         <div class="row pt-3 ps-4 pe-4">
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" value="${gstData[0]?.gst_number || '-'}" />
            //                     <label for="" class="sty-label">GST Number</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Billing State</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="text" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Billing Name</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <textarea class="w-100 sty-inp form-control" name="" id="" cols="30"
            //                         rows="1"></textarea>
            //                     <label for="" class="sty-label">Billing Address</label>
            //                 </div>
            //             </div>
            //             <div class="col-lg-4 mb-3">
            //                 <div class="w-100 sty-input-wrapper">
            //                     <input type="number" class="w-100 sty-inp" />
            //                     <label for="" class="sty-label">Contact Number</label>
            //                 </div>
            //             </div>
            //         </div>
            //         <hr>

            //         <div class="two-btn float-end pb-3 pe-4">
            //             <button type="button" class="btn btn-secondary"
            //                 data-bs-dismiss="modal">Close</button>
            //             <button type="submit" class="btn btn-primary">Update</button>
            //         </div>
            //     </form>
            //     `;

            //     if (vehicleData && vehicleData.length > 0) {
            //         vehicleData.forEach(function (item) {
            //             vehicleContent += 
            //             `
            //             <form action="">
            //                 <h1>===============VEHICLE=========</h1>
            //                 <div id="newVehicle">                                    
            //                     <div class="row mt-3" id="cloneVehicle">
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="text" class="w-100 sty-inp" id="id_parking_lot0" value="${vehicleData[0]?.parking_lot || ''}" />
            //                         <label for="id_parking_lot0" class="sty-label">Parking Lot</label>
            //                         <small id="Error_id_parking_lot0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="text" class="w-100 sty-inp" id="id_vehicle_type0" />
            //                         <label for="id_vehicle_type0" class="sty-label">Vehicle Type</label>
            //                         <small id="Error_id_vehicle_type0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="text" class="w-100 sty-inp" id="id_vehicle_number0" />
            //                         <label for="id_vehicle_number0" class="sty-label">Vehicle Number</label>
            //                         <small id="Error_id_vehicle_number0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="text" class="w-100 sty-inp" id="id_vehicle_brand0" />
            //                         <label for="id_vehicle_brand0" class="sty-label">Brand & Model</label>
            //                         <small id="Error_id_vehicle_brand0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="file" class="w-100 sty-inp form-control" id="id_rc_copy0" />
            //                         <label for="id_rc_copy0" class="sty-label">RC Copy</label>
            //                         <small id="Error_id_rc_copy0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <input type="text" class="w-100 sty-inp form-control" id="id_sticker_number0" />
            //                         <label for="id_sticker_number0" class="sty-label">Sticker Number</label>
            //                         <small id="Error_id_sticker_number0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3">
            //                         <div class="w-100 sty-input-wrapper">
            //                         <select class="w-100 sty-inp form-control" name="" id="id_select_charge0"
            //                             onchange="selectChange(this.id, ('related_' + this.id), ('vehicle_' + this.id))">
            //                             <option value="#" selected>YES / NO</option>
            //                             <option id="optN0" value="no">NO</option>
            //                             <option id="optY0" value="yes">YES</option>
            //                         </select>
            //                         <!-- <input type="text" class="w-100 sty-inp"> -->
            //                         <label for="id_select_charge0" class="sty-label">Vehicle Chargeable</label>
            //                         <small id="Error_id_select_charge0" class="error-message"></small>
            //                         </div>
            //                     </div>
            //                     <div class="col-lg-4 mb-3" id="addCharge0">
            //                         <div class="w-100 sty-input-wrapper" id="vehicle_id_select_charge0">
            //                     </div>
            //                     </div>
            //                     <hr />
            //                 </div>
            //                 <div class="row" id="newVehicleContainer"></div>
            //                 </div>
            //             </form> 

            //             `;
            //         });
            //         vehicleContent += 
            //         `
            //             <input type="button" name="" class="add-mem-btn float-start" id="addVehicles" value="Add Vehicle" onclick="addVehicle()" />
            //         `;
            //     }else{
            //         vehicleContent += 
            //         `
            //             <input type="button" name="" class="add-mem-btn float-start" id="addVehicles" value="Add Vehicle" onclick="addVehicle()" />
            //         `;
            //     }
                
            //     $('#memberEditForm').html(htmlContent);
            //     $('#sharedmemberEditForm').html(sharedContent);
            //     $('#homeloanEditForm').html(homeLoanContent);
            //     $('#gstEditform').html(gstContent);
            //     $('#vehicleEditForm').html(vehicleContent);
            // }
        
        },
        error: function (xhr) {
            alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        }
    });
}


