
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
                    $("#id_is_primary").show();
                } else {
                    $("#id_is_primary").hide();
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
        let isValid = true;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const max100NumberRegex = /^(?:[1-9]\d{2,}|1000+)$/;
        let numberregex = /^([1-9]\d{0,1}|100)$/;
        let required_fields = {
            // members ids
            "id_wing_flat": "Pls select the flat number!",
            // "id_member_name": "Member name is required!",
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
                } else if (value && ((key === "id_member_email") || (key.startsWith("id_nominee_email")) && !emailRegex.test(value))) {
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Invalid Email!");
                } else if (value && ((key === "id_member_ownership") && !numberregex.test(value))) {
                    // console.log("NUMBER===============")
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text("Percentage shoule be below 100");
                } else {
                    $("#" + key).css("border-color", ""); // Reset to default
                    $("#" + key + "_Error").text(""); // Clear the error message
                }
            }


            // let validate_ownership = [{"member_ownership": $('#id_member_ownership').val(), "wing_flat_number": $('#id_wing_flat').val()}]
            let formData = new FormData();
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
                        isValid = false;
                    } else {
                        $("#id_member_ownership").css("border-color", "");
                        $("#id_member_ownership_Error").text("");
                        isValid = true;
                        // tryna fix it might create problem later
                        stopNext = true;
                    }
                },
                error: function (xhr) {
                    alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
                }
            });
            return isValid;
        }


        if (!validateForm(1)) {
            stopNext = false
        } else {
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
                    ["nomination_date"]: $('#id_nomination_date' + count).val(),
                    ["nominee_relation"]: $('#id_nominee_relation' + count).val(),
                    ["naminee_sharein"]: $('#id_naminee_sharein' + count).val(),
                    ["nominee_dob"]: $('#id_nominee_dob' + count).val(),
                    ["nominee_aadhar_no"]: $('#id_nominee_aadhar_no' + count).val(),
                    ["nominee_pan_no"]: $('#id_nominee_pan_no' + count).val(),
                    ["nominee_email"]: $('#id_nominee_email' + count).val(),
                    ["nominee_address"]: $('#id_nominee_address' + count).val(),
                    ["nominee_state"]: $('#id_nominee_state' + count).val(),
                    ["nominee_pin_code"]: $('#id_nominee_pin_code' + count).val(),
                    ["nominee_contact_number"]: $('#id_nominee_contact_number' + count).val(),
                    ["nominee_emergency_contact"]: $('#id_nominee_emergency_contact' + count).val(),
                });
            }
            memberData.push({
                ["wing_flat"]: $('#id_wing_flat').val(),
                ["member_name"]: $('#id_member_name').val(),
                ["member_ownership"]: $('#id_member_ownership').val(),
                ["member_position"]: $('#id_member_position').val(),
                ["member_dob"]: $('#id_member_dob').val(),
                ["member_pan_number"]: $('#id_member_pan_number').val(),
                ["member_aadhar_no"]: $('#id_member_aadhar_no').val(),
                ["member_address"]: $('#id_member_address').val(),
                ["member_state"]: $('#id_member_state').val(),
                ["member_pin_code"]: $('#id_member_pin_code').val(),
                ["member_email"]: $('#id_member_email').val(),
                ["member_contact"]: $('#id_member_contact').val(),
                ["member_emergency_contact"]: $('#id_member_emergency_contact').val(),
                ["member_occupation"]: $('#id_member_occupation').val(),
            });

            let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            let headers = {
                "X-CSRFToken": csrfToken
            };
            let formData = new FormData();
            let memberDataJson = JSON.stringify(memberData);
            let nomineeDataJson = JSON.stringify(nomineeData);
            formData.append('memberData', memberDataJson);
            formData.append('nomineeData', nomineeDataJson);
            formData.append('member_ownership', $('#id_member_ownership').val());
            formData.append('wing_flat_number', $('#id_wing_flat').val());

            // $.ajax({
            //     url: '/member-master/',
            //     method: 'POST',
            //     data: formData,
            //     headers: headers,
            //     processData: false,
            //     contentType: false,
            //     success: function (response) {
            //         console.log("Success");
            //         toastr.success(response.message, "Member Details Added!");
            //         // $("#bankForm")[0].reset();
            //     },
            //     error: function (xhr) {
            //         alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
            //     }
            // });
        }
    });

    $("#addSharesDetail").click(function (e) {
        // alert("CALLING");
        let required_fields = {
            // "id_shared_wing_flat_select": "Pls select the flat number!",
            // "id_folio_number": "Folio number is required!",
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

        if ((!validateForm()) && (!validateFields())) {
            stopNext = false
        } else {
            let sharedData = []
            Object.keys(required_fields).forEach(function (field) {
                sharedData.push({ [field]: $('#' + field).val() });
            });
            var formData = new FormData();
            formData.append('form_name', "shared_form");
            formData.append('shares_json', JSON.stringify(sharedData));

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: "/member-master/",
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
                if (value === "" || ((key == "id_bank_loan_status") && (value == "#"))) {
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
            stopNext = false
        } else {
            console.log("ELSE=================")
            let sharedData = []
            Object.keys(required_fields).forEach(function (field) {
                sharedData.push({ [field]: $('#' + field).val() });
            });
            var formData = new FormData();
            formData.append('form_name', "shared_form");
            formData.append('shares_json', JSON.stringify(sharedData));
            if ($('#id_bank_loan_noc_file')[0].files.length > 0) {
                formData.append('id_bank_loan_noc_file', $('#id_bank_loan_noc_file')[0].files[0]);
            }

            let headers = {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value
            };

            $.ajax({
                url: "/member-master/",
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
            // "id_member_gst_number": "Gst number required!",
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
            stopNext = false
        } else {
            stopNext = true
            console.log("")
        }

    });

    $("#vehicleFormSubmit").click(function (e) {
        // get all the values here
        let isValid = true;
        let required_fields = {}
        getAllVehicleDetails = {
            "id_parking_lot": "Parking log is reqired!",
            "id_vehicle_type": "Vehicle type is required!",
            "id_vehicle_number": "Vehicle number is required!",
            "id_vehicle_brand": "Vehicle brand is required!",
            "id_rc_copy": "Vehicle cpy is required!",
            "id_sticker_number": "Sticker number is required!",
            "id_select_charge": "Vehiche chargable or not, pls select one!",
            "new_vehicle_id_select_charge": "Charge amount is reqired!",
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
            stopNext = false
            console.log("failed")
        } else {
            console.log("success")
            // let reg_name = $("#unique_reg_number").val()
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
            // "id_admin_email": "Email cannnot be empty",
            // // "id_alternate_email": "Alternate email cannot be empty",
            // "id_registration_number": "Reg. No. cannot be empty!",
            // "id_registration_doc": "Doc cannot be empty",
            // "id_admin_mobile_number": "Mobile Number cannot be empty!",
            // "id_pan_number": "Pan No. cannot be empty",
            // "id_pan_number_doc": "Pan doc cannot be empty",
            // "id_gst_number": "Gst Number is required",
            // "id_gst_number_doc": "Gst doc be empty",
            // "id_interest": "Interest cannot be empty",
            // "id_society_reg_address": "Society reg. address required!",
            // "id_society_city": "City is required!",
            // "id_socity_state": "State cannot be empty!",
            // // "id_alternate_mobile_number": "Alternate mobile number required!",
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
        // var required_fields = {
        //     // 'id_beneficiary_name': "Beneficiary name cannot be empty!",
        //     // 'id_beneficiary_code': "Beneficiary code cannot be empty!",
        //     // 'id_beneficiary_acc_number': "Beneficiary account no. cannot be empty!",
        //     // 'id_beneficiary_bank': "Beneficiary bank cannot be empty!",
        // };

        // let id_beneficiary_name = Array.from(document.querySelectorAll('[id^="id_beneficiary_name"]'))
        //     .filter(element => !element.id.includes('_Error'))
        //     .map(element => {
        //         required_fields[element.id] = "Beneficiary name is required!"; // Add the id and message to the required_fields object
        //         return element;
        //     });

        // let id_beneficiary_code = Array.from(document.querySelectorAll('[id^="id_beneficiary_code"]'))
        //     .filter(element => !element.id.includes('_Error'))
        //     .map(element => {
        //         required_fields[element.id] = "Beneficiary code is required!"; // Add the id and message to the required_fields object
        //         return element;
        //     });

        // let id_beneficiary_acc_number = Array.from(document.querySelectorAll('[id^="id_beneficiary_acc_number"]'))
        //     .filter(element => !element.id.includes('_Error'))
        //     .map(element => {
        //         required_fields[element.id] = "Beneficiary account no. is required!"; // Add the id and message to the required_fields object
        //         return element;
        //     });

        // let id_beneficiary_bank = Array.from(document.querySelectorAll('[id^="id_beneficiary_bank"]'))
        //     .filter(element => !element.id.includes('_Error'))
        //     .map(element => {
        //         required_fields[element.id] = "Beneficiary bank name is required!"; // Add the id and message to the required_fields object
        //         return element;
        //     });

        // let id_isPrimary = Array.from(document.querySelectorAll('[id^="id_isPrimary"]'))
        //     .filter(element => !element.id.includes('_Error'))
        //     .map(element => {
        //         required_fields[element.id] = "pls select this box, to make it primary!"; // Add the id and message to the required_fields object
        //         return element;
        //     });

        // // console.log("required_fields======", required_fields)

        // let checkboxes = document.querySelectorAll('[id^="id_isPrimary"]')
        // let anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        // // Check if any of the checkboxes is checked

        // // Display an alert if at least one checkbox is checked
        // // if (anyChecked) {
        // //     alert("At least one checkbox is checked!");
        // // } else {
        // //     alert("None of the checkboxes are checked.");
        // // }

        // function validateForm(step) {
        //     let isValid = true;
        //     let anyOneIsChecked = false;
        //     for (var key in required_fields) {
        //         let value = $("#" + key).val().trim();
        //         // if (!($("#" + key).prop('checked'))){
        //         //     anyOneIsChecked = true;
        //         // }
        //         if (value === "" || $("#" + key).prop('checked')) {
        //             isValid = false;
        //             // if (!anyChecked) {                       

        //             if (!($("#" + key).prop('checked')) && !anyChecked) {
        //                 // alert("None of the checkboxes are checked.");
        //                 console.log("1==========================")
        //                 $("#" + key).css("border-color", "red");
        //                 $("#" + key + "_Error").text(required_fields[key]);
        //             } else {
        //                 console.log("2==========================")
        //                 $("#" + key).css("border-color", "red");
        //                 $("#" + key + "_Error").text(required_fields[key]);
        //             }
        //         } else {
        //             $("#" + key).css("border-color", ""); // Reset to default
        //             $("#" + key + "_Error").text(""); // Clear the error message
        //         }
        //     }
        //     return isValid;
        // }


        // if (!validateForm(1)) {
        //     stopNext = false
        // } else {
        //     let reg_name = $("#unique_reg_number").val()
        //     stopNext = true
        //     let form_fields = [
        //         'beneficiary_name', 'beneficiary_code', 'beneficiary_acc_number', 'beneficiary_bank'
        //     ]
        //     let ajaxUrl = $("#ajax-url").data("url");
        //     let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        //     var headers = {
        //         "X-CSRFToken": csrfToken
        //     };
        //     var formData = new FormData();
        //     formData.append('form_name', 'bankForm');
        //     formData.append('unique_reg_number', reg_name);

        //     let bankDetails = [];

        //     for (var i = 1; i < id_beneficiary_name.length + 1; i++) {
        //         // form_fields.forEach(function (field) {
        //         // formData.append(field, $('#id_' + field + i).val());
        //         console.log("number is===========", i)
        //         bankDetails.push({
        //             ["beneficiary_name"]: $('#id_beneficiary_name' + i).val(),
        //             ["beneficiary_code"]: $('#id_beneficiary_code' + i).val(),
        //             ["beneficiary_acc_number"]: $('#id_beneficiary_acc_number' + i).val(),
        //             ["beneficiary_bank"]: $('#id_beneficiary_bank' + i).val(),
        //             ["isPrimary"]: $('#id_isPrimary' + i).val(),
        //         });
        //         // });
        //     }

        //     let bankDataJson = JSON.stringify(bankDetails);
        //     formData.append('bankDataJson', bankDataJson);
        //     console.log("bank details========================", bankDataJson)

        //     $.ajax({
        //         url: ajaxUrl,
        //         method: 'POST',
        //         data: formData,
        //         headers: headers,
        //         processData: false,
        //         contentType: false,
        //         success: function (response) {
        //             console.log("Success")
        //             if (response.status) {
        //                 alert(response.status)
        //             }
        //             toastr.success(response.message, "Bank Details Added!");
        //             $("#bankForm")[0].reset();
        //         },
        //         error: function (xhr) {
        //             alert("Something went wrong! " + xhr.status + " " + xhr.statusText);
        //         }
        //     });
        // }


        let isValid = true;
        let required_fields = {}
        let checkedPassed = false;
        let bankData = [];
        getAllBankDetails = {
            'id_beneficiary_name': "Beneficiary name cannot be empty!",
            'id_beneficiary_code': "Beneficiary code cannot be empty!",
            'id_beneficiary_acc_number': "Beneficiary account no. cannot be empty!",
            'id_beneficiary_bank': "Beneficiary bank cannot be empty!",
            'id_isPrimary': "Pls select to make this primary!"
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
                }else if($("#" + key).is(":checkbox") && !checkedPassed){
                    isValid = false;
                    $("#" + key).css("border-color", "red");
                    $("#" + key + "_Error").text(required_fields[key]); 
                } else if (trueCount && $("#" + key).prop('checked')){
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
            "id_completion_cert": "Completion Cert. is required!",
            "id_occupancy_cert": "Occupancy Cert. is required!",
            "id_deed_of_conveyance": "Deed of conveyance is required!",
            "id_society_by_law": "Society by law is required!",
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




// add nomine end



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
    if (selectElement.value === "option2") { // "option2" corresponds to "YES"
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

