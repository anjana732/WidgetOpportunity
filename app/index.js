$(document).ready(function () {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
        console.log("Initial Data:", data);
        EntityId = data.EntityId[0];
        console.log("Entity ID " + EntityId);


        //getting dropdown value

        $("#dropdown").on("change", function () {
            let selectedValue = $(this).val();
            console.log(selectedValue);
            if (selectedValue == "Opportunity") {
                $("#create-opportunity-btn").show();
                $("#opportunity-table").show();
            } else {
                $("#create-opportunity-btn").hide();
            }
        })

        $("#create-opportunity-btn").on("click", function () {
            $("#create-opportunity").show();
        })

        //Getting the details of account of particular Id
        ZOHO.CRM.API.getRecord({
            Entity: "Accounts", approved: "both", RecordID: EntityId
        })
            .then(function (response) {
                console.log("Account Detail"+JSON.stringify(response));
                accountName = response.data[0].Account_Name;
                $("#account-name").val(accountName).prop('disabled', true);
            })
            .catch(function (err) {
                console.log("Error in getting Account name: " + err);
            })
        
        //getting the data from form of add opportunity

        $("#add-opportunity").on("click", function () {
            let closerDate = $("#closer-date").val();
            let deliveryDate = $("#delivery-date").val();
            let dealName = $("#deal-name").val();
            let stage = $("#stage").val();
          //  let stageText = stage.find("option:selected").text();

            console.log("Order Colser Date: " + closerDate);
            console.log("Order Delivery Date :" + deliveryDate);
            console.log("Deal Name : "+dealName);
            console.log("Stage: "+stage);
            if (deliveryDate > closerDate) {
                alert("Closer date should be greater");
            }
            //Inserting the data to Account's Deal related List

        var opportunityData = {
            "Deal_Name": dealName,
            "Account_Name" : EntityId,
            "Stage": stage,
            "Closing_Date" : closerDate,
            "Order_Closer_Date" : closerDate,
            "Order_Delivery_Date": deliveryDate
        }
        console.log("opportunityData:",opportunityData);
        ZOHO.CRM.API.insertRecord({ Entity: "Deals", APIData: opportunityData,}).then(function (data) {
            console.log("Data added "+ JSON.stringify(data));
        }).catch((err)=>{
            console.log("Error fetching data :"+err);
        });

        })
        //getting all the opportunity using related List
        ZOHO.CRM.API.getRelatedRecords({ Entity: "Accounts", RecordID: EntityId, RelatedList: "Deals" })
            .then(function (dealData) {
                console.log("All list from opportunity" + JSON.stringify(dealData));
                console.log(dealData.data.Deal_Name);
                dealData.data.forEach(deal => {
                    let row = `<tr>
                        <td>${deal.Deal_Name || 'N/A'}</td>
                        <td>${deal.Stage || 'N/A'}</td>
                        <td>${deal.Contact_Name ? deal.Contact_Name.name : 'N/A'}</td>
                        <td>${deal.Account_Name ? deal.Account_Name.name : 'N/A'}</td>
                        <td>
                            <select>
                                <option value="Qualification" ${deal.Stage === 'Qualification' ? 'selected' : ''}>Qualification</option>
                                <option value="Need Analysis" ${deal.Stage === 'Need Analysis' ? 'selected' : ''}>Need Analysis</option>
                                <option value="Value Proposition" ${deal.Stage === 'Value Proposition' ? 'selected' : ''}>Value Proposition</option>
                                <option value="Identify Decision Maker" ${deal.Stage === 'Identify Decision Maker' ? 'selected' : ''}>Identify Decision Maker</option>
                                <option value="Proposal/Price Quote" ${deal.Stage === 'Proposal/Price Quote' ? 'selected' : ''}>Proposal/Price Quote</option>
                                <option value="Negotiation/Review" ${deal.Stage === 'Negotiation/Review' ? 'selected' : ''}>Negotiation/Review</option>
                                <option value="Closed Won" ${deal.Stage === 'Closed Won' ? 'selected' : ''}>Closed Won</option>
                                <option value="Closed Lost" ${deal.Stage === 'Closed Lost' ? 'selected' : ''}>Closed Lost</option>
                                <option value="Closed To Competition" ${deal.Stage === 'Closed To Competition' ? 'selected' : ''}>Closed To Competition</option>
                            </select>
                        </td>
                    </tr>`;
                    $("#opportunity-table tbody").append(row);
                });
            })
    });
    ZOHO.embeddedApp.init();
});
