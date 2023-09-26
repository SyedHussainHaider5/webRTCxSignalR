import { Component, ElementRef, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalrService } from '../signalr.service';
@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.scss'],
})
export class VideocallComponent {
  // console.log("ICE Connection State: ", pc.iceConnectionState);

  constructor(private signalrService: SignalrService) {}
  /////////Getting html elements here/////////////////////
  /////////////////////////////////////////////////////////////
  @ViewChild('webcamButton', { static: true }) webcamButton!: ElementRef;
  @ViewChild('callButton', { static: true }) callButton!: ElementRef;
  @ViewChild('webcamVideo', { static: true }) webcamVideo!: ElementRef;
  @ViewChild('callInput', { static: true }) callInput!: ElementRef;
  @ViewChild('answerButton', { static: true }) answerButton!: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo!: ElementRef;
  @ViewChild('hangupButton', { static: true }) hangupButton!: ElementRef;

  ////////////////////////////////

  // webcamButton = document.getElementById('webcamButton') as HTMLButtonElement;
  // webcamVideo = document.getElementById('webcamVideo') as HTMLVideoElement;
  // callButton = document.getElementById('callButton') as HTMLButtonElement;
  // callInput = document.getElementById('callInput') as HTMLInputElement;
  // answerButton = document.getElementById('answerButton') as HTMLButtonElement;
  // remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
  // hangupButton = document.getElementById('hangupButton') as HTMLButtonElement;
  ////////////////////////////////////////////////////////

  async startWebcam() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const remoteStream = new MediaStream();

    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream as MediaStream);
    });

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        (remoteStream as MediaStream).addTrack(track);
      });
    };

    this.webcamVideo.nativeElement.srcObject = this.localStream;
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;

    this.callButton.nativeElement.disabled = false;
    this.answerButton.nativeElement.disabled = false;
    this.webcamButton.nativeElement.disabled = true;
  }

  servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  pc = new RTCPeerConnection(this.servers);

  // console.log("ICE Connection State: ", pc.iceConnectionState);
  remoteStream: MediaStream | null = null;

  localStream: MediaStream | null = null;

  async setOfferCandidates() {
    const offerCandidates: string | any[] = [];
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        offerCandidates.push(event.candidate.toJSON());
      } else {
        // const offerCandidatesJSON = JSON.stringify(offerCandidates);
        console.log('This is the data in array: ' + offerCandidates);
        console.log(
          'The Type of offerCandidates is: ' + typeof offerCandidates
        );
        this.signalrService.setOfferCandidates(JSON.stringify(offerCandidates));
      }
    };

    const offerDescription = await this.pc.createOffer();
    this.pc.setLocalDescription(offerDescription);
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    console.log("I'm, here!");
    this.signalrService.setOffer(JSON.stringify(offer));
  }

  async setAnswerCandidates() {
    const answerCandidates: string | any[] = [];
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        answerCandidates.push(event.candidate.toJSON());
      } else {
        // const offerCandidatesJSON = JSON.stringify(offerCandidates);
        console.log('This is the data in array: ' + answerCandidates);
        console.log(
          'The Type of answerCandidates is: ' + typeof answerCandidates
        );
        this.signalrService.setAnswerCandidates(
          JSON.stringify(answerCandidates)
        );
      }
    };

    const offerDescription = await this.signalrService.getOffer();
    const jsonOfferDescription = JSON.parse(offerDescription);
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(jsonOfferDescription)
    );

    const answerDescription = await this.pc.createAnswer();
    this.pc.setLocalDescription(answerDescription);
    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };
    console.log("I'm, here in answer!");
    this.signalrService.setAnswer(JSON.stringify(answer));
  }
}
