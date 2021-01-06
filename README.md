# guillaumeblackburn.github.io
Ground Profiler

Application to get elevations data along a path.



##Version 2.1
Revision date: 2020-01-06

Correction 
  ```function get_elevation_points(){
    botHub = CL.getPath().Mb[0];
    topHub = CL.getPath().Mb[1];
    let params = {'path': [botHub,topHub],'samples':PROFILE.nb_elev_points,}
    elevator.getElevationAlongPath(params, draw_elev_points)
  }```
