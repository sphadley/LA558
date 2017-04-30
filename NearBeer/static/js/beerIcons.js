var darkIcon = new L.Icon({
  iconUrl: '/static/dark.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var mediumDarkIcon = new L.Icon({
  iconUrl: '/static/mediumDark.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var mediumIcon = new L.Icon({
  iconUrl: '/static/medium.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var mediumLightIcon = new L.Icon({
  iconUrl: '/static/mediumLight.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var lightIcon = new L.Icon({
  iconUrl: '/static/light.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getMarkerColors(score) 
{
    if(personNumber == 3)
    {
        if(score == 2)
        {
            return darkIcon;
        }
        else
        {
            return lightIcon;
        }
    }
    else if(personNumber == 4)
    {
        if(score == 3)
        {
            return darkIcon;
        }
        else if(score == 2 )
        {
            return mediumIcon;
        }
        else
        {
            return lightIcon;
        }
    }
    else
    {
        if (score == personNumber - 1)
        {
            return darkIcon;
        }
        else if(score == personNumber -2)
        {
            return mediumDarkIcon;
        }
        else if(score == personNumber -3)
        {
            return mediumIcon;
        }
        else if(score == personNumber -4)
        {
            return mediumLightIcon;
        }
        else
        {
            return lightIcon;
        }
    }
}

