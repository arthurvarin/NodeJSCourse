# Welcome to my ReadMe
## Introduction
This readme will teach you everything you need to know about this program

## Installation
You have to compile and upload the code **ECGproject.c** onto your xm1000 by executing the command _sudo make ECGproject.upload TARGET=xm1000_

Then you can launch the program by executing the command _sudo make login TARGET=xm1000_

If you want a more visual experience you can upload the program **ECGprojectVisual.c** instead

## Usage

The program will give you an emulation of an ECG output by reproducing the signal PQRST 

The cardiac frequency is proportionnal to the luminosity measured by the sensor, approach a light source from the sensor to increase the cardiac frequency.

If the patient goes into bradycardy (low bpm) the blue led will light up, if the patient goes into tachycardie (high bpm) the red led will light up.

## Upload to Ubidots

You can upload values to the ubidots platform by calling **IssueUpload** and giving the _variable name_ as first argument and the _variable value_ as the second argument

Execute the command _python IssueUpload tachy 130_ for example

## Developpers
This program has been developped by _Arthur Varin_ and _Nassim Chouf_