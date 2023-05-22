<?php

namespace App\Controller;

use App\Entity\Picture;
use App\Entity\Vote;
use App\Repository\CompetitionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController {
    
        public function __construct(
            private CompetitionRepository $competitionRepository
        ) {}
    
        
        #[Route('/test', name: 'test')]
        public function __invoke(): array
        {
            $competitions = $this->competitionRepository->findAll();
            // find first
            $competitions = $competitions[0];
            
            
            $lastPicturesPosted = $competitions->getPictures()->toArray();
            usort($lastPicturesPosted, function($a, $b){
                // sort by id
                return $a->getId() <=> $b->getId();
            });
            $lastPicturesPosted = array_slice($lastPicturesPosted, 0, 8);
            
            $picturesObtainedPrice = $competitions->getPictures()->filter(function(Picture $picture){
                return $picture->isPriceWon() !== null;
            })->toArray();
            usort($picturesObtainedPrice, function($a, $b){
                // sort by id
                return $a->getId() <=> $b->getId();
            });
            $picturesObtainedPrice = array_slice($picturesObtainedPrice, 0, 8);
            
            $lastPicturesObtainedVotes = $competitions->getPictures()->filter(function(Picture $picture){
                return $picture->getVotes()->count() > 0;
            })->toArray();
            usort($lastPicturesObtainedVotes, function(Picture $a, Picture $b){
                // sort by lastVote 
                $lastVoteA = $a->getVotes()->toArray();
                usort($lastVoteA, function(Vote $a, Vote $b){
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteA = $lastVoteA[count($lastVoteA) - 1];
                
                $lastVoteB = $b->getVotes()->toArray();
                usort($lastVoteB, function(Vote $a, Vote $b){
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteB = $lastVoteB[count($lastVoteB) - 1];
                
                return $lastVoteA->getVoteDate() <=> $lastVoteB->getVoteDate();
            });
            $lastPicturesObtainedVotes = array_slice($lastPicturesObtainedVotes, 0, 8);
            
            
            dd($lastPicturesPosted, $picturesObtainedPrice, $lastPicturesObtainedVotes);
            
            if($competitions->getState() === 2 || $competitions->getState() === 3){
                return ["aside" => $lastPicturesPosted, "asideLabel" => "Dernières photos soumises"];
            }elseif($competitions->getState() === 4 || $competitions->getState() === 5){
                return ["aside" => $lastPicturesObtainedVotes,  "asideLabel" => "Dernières photos ayant obtenu un vote"];
            }elseif($competitions->getState() === 6){
                return ["aside" => $picturesObtainedPrice, "asideLabel" => "Dernières photos ayant obtenu un prix"];
            }
        }
}