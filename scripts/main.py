#!/usr/bin/env python
import rospy
import os, rospkg, errno
import json
import jsonpickle
import random
import ast
import subprocess
from datetime import datetime

from ros_music_therapy.srv import GetPlaylist, EditValue, SaveSurvey

startSongValue = 5
minSongValue = 1
maxSongValue = 10

rp = rospkg.RosPack()
base_dir = rp.get_path("ros_music_therapy")
save_dir = os.path.join(base_dir, "data")

class MusicTherapy(object):

    def __init__(self):
        self.savepath = os.path.join(save_dir, "songlist.save")
        self.answerpath = os.path.join(save_dir, "answers.save")
        self.songlist = {}
        self.loadSonglist()
        self.updateSonglist()
        print(self.songlist)

    def saveSonglist(self):
        try:
            try:
                os.makedirs(save_dir)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    print("Error when creating the save file path: " + str(e))
            songlistJson = jsonpickle.encode(self.songlist)
            with open(self.savepath, 'w') as f:
                f.write(songlistJson)
        except Exception as e:
            print("SaveSonglist error: " + str(e))

    def loadSonglist(self):
        try:
            with open(self.savepath, 'r') as f:
                songlistJson = f.read()
            self.songlist = jsonpickle.decode(songlistJson)
        except Exception as e:
            print("Save file not existing, creating new one")

    #Read the songs from the youtubeLinks file and add then to the songlist
    def updateSonglist(self):
        try:
            linksFile = os.path.join(base_dir, "youtubeLinks.json")
            with open(linksFile, 'r') as f:
                links = (json.load(f))["links"]
                for link in links:
                    if link not in self.songlist:
                        self.songlist[link] = startSongValue
        except Exception as e:
            print("UpdateSongList error: " + str(e))

    def getPlaylist(self, req):
        numSongs = req.numSongs
        print("NUMSONGS: "+str(numSongs))
        print(self.songlist)
        playlist = []
        #Create an array with value sums up to every link, used for random extraction
        partialSums = []
        tempLinks = []
        n = 0
        currSum = 0
        for link in self.songlist:
            currSum += self.songlist[link]
            partialSums.append(currSum)
            tempLinks.append(link)
            n += 1
        #Extract numSongs songs randomly without repetition
        print(partialSums)
        print(tempLinks)
        for i in range(numSongs):
            randNum = random.randint(1, partialSums[n-1])
            print(randNum)
            for j in range(n):
                if partialSums[j]>=randNum:
                    playlist.append(tempLinks[j])
                    tempValue=partialSums[j]
                    if j==0:
                        diff=tempValue
                    else:
                        diff=tempValue-partialSums[j-1]
                    for k in range(j+1, n):
                        partialSums[k]-=diff
                    partialSums.remove(tempValue)
                    tempLinks.remove(tempLinks[j])
                    break
            n-=1
            print(partialSums)
            print(tempLinks)
        return jsonpickle.encode(playlist)

    def editValue(self, req):
        link = req.link
        value = req.value
        if link in self.songlist:
            self.songlist[link] += value
            if self.songlist[link] < minSongValue:
                self.songlist[link]=minSongValue
            elif self.songlist[link] > maxSongValue:
                self.songlist[link]=maxSongValue
            self.saveSonglist()
            print(self.songlist)
            return 0
        else:
            print("Error editValue: link "+link+" not in songlist")
            return 1

    def saveSurvey(self, req):
        print("New survey answers: "+str(req))
        sessionLength = req.sessionLength
        answers = ast.literal_eval(req.answers)
        print(answers)
        date = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        newAnswer = {
            "answers": answers,
            "sessionLength": sessionLength
        }
        try:
            try:
                os.makedirs(save_dir)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    print("Error when creating the save file path: " + str(e))
                    raise
            newAnswerJson = jsonpickle.encode(newAnswer)
            allAnswers = {}
            try:
                with open(self.answerpath, 'r') as f:
                    allAnswers = jsonpickle.decode(f.read())
            except Exception as e:
                print("Save file not existing, creating new one")
            allAnswers[date] = newAnswerJson
            with open(self.answerpath, 'w') as f:
                f.write(jsonpickle.encode(allAnswers))
            return 0
        except Exception as e:
            print("SaveSurvey error: " + str(e))
            raise
            return 1
        

def main():

    #Start web server
    rp = rospkg.RosPack()
    web_dir = os.path.join(rp.get_path("ros_music_therapy"), "web")
    web_script = os.path.join(web_dir, "startMusictherapy.sh")
    print("Starting web server using: " + web_script)
    webserverProcess = subprocess.Popen([web_script, web_dir])

    #Start ros program
    myMusicTherapy = MusicTherapy()

    rospy.init_node("ros_music_therapy", anonymous=True)
    
    getPlaylistSrv = rospy.Service('get_playlist', GetPlaylist, myMusicTherapy.getPlaylist)
    editValueSrv = rospy.Service('edit_value', EditValue, myMusicTherapy.editValue)
    saveSurveySrv = rospy.Service('save_survey', SaveSurvey, myMusicTherapy.saveSurvey)

    rospy.spin()

if __name__ == "__main__":
    try:
        main()
    except rospy.ROSInterruptException:
        pass


#TODO
