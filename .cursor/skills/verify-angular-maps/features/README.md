# Feature map: angular-maps

Technical demo/starter combining Google Maps (@agm/core) and three.js in Angular 15.

- 3D scene (map.component): three.js WebGL canvas, OrbitControls, cubes from MockDataService colors/positions. Verified: canvas renders real pixels at both widths.
- Google map (gmap.component): agm-map centered San Francisco (37.7749, -122.4194), zoom 5; map clicks emit coordinates through MapInteractionService toward the 3D scene. Requires a real API key - placeholder ships; map area verified present but blank without one.
- hello.component: starter boilerplate remnant.
