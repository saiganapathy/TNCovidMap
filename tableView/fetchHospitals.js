var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';

window.allTableDetails = [];

function getTableData(){
    console.log("fetchHospitalscalled");
    var tableData = [];
    
     var params = {"searchString":"",
            "sortCondition":{"Name":1},
             "pageNumber":1,
             "pageLimit":2000,
             "SortValue":"Availability",
             "ShowIfVacantOnly":"",
             "IsGovernmentHospital":true,
             "IsPrivateHospital":true,
             "FacilityTypes":["CHO","CHC","CCC"]
        };
    
        $.ajax({
        method:'post',
        url: 'https://tncovidbeds.tnega.org/api/hospitals',
        data: JSON.stringify(params),
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            data.result.forEach((hospital, index)=>{
                var newHospital = {};
                
                newHospital.Name = hospital.Name;
                if(hospital.AddressDetail!==undefined){
                    const taluk = hospital.Taluk!==undefined?hospital.Taluk.Name:''
                    const district = hospital.District!==undefined?hospital.District.Name:''
                    if(hospital.AddressDetail.Line1!==undefined && hospital.AddressDetail.Line1!==null){
                        addressString = hospital.AddressDetail.Line1;
                    }
                    if(hospital.AddressDetail.Line2!==undefined && hospital.AddressDetail.Line2!==null){
                        addressString = addressString + " - " + hospital.AddressDetail.Line2; 
                    }
                    if(hospital.AddressDetail.Line3!==undefined && hospital.AddressDetail.Line3!==null){
                        addressString = addressString + " - "+  hospital.AddressDetail.Line3;
                    }
                    newHospital.Address = addressString+","+taluk+","+district;
                }
                newHospital.contactNumber=hospital.MobileNumber;
                newHospital.o2BedsAvailable=hospital.CovidBedDetails.VaccantO2Beds;
                newHospital.non02BedsAvailable=hospital.CovidBedDetails.VaccantNonO2Beds;
                newHospital.icuBeds=hospital.CovidBedDetails.VaccantICUBeds;
                
                var recordId = "recid-";
                newHospital.recid = recordId + index;
                
                tableData.push(newHospital);   
                });
            }
        });
    allTableDetails = tableData;
    
    return tableData;
}