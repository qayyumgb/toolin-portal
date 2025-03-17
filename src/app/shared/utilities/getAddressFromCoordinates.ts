

async function  getAddressFromCoordinates(lat: number, lng: number,) {
  
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
  
    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const formattedAddress = results[0].formatted_address;
          console.log("Address:", formattedAddress);
          return formattedAddress
        } else {
          console.error("No address found.");
          return null
        }
      } else {
        console.error("Geocoder failed due to: " + status);
        return null
      }
    });
  }

  export default getAddressFromCoordinates