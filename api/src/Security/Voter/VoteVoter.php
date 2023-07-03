<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class VoteVoter extends Voter
{
    public const EDIT = 'VOTE_EDIT';
    public const VIEW = 'VOTE_VIEW';

    public function __construct(private Security $security)
    {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof \App\Entity\Vote;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {

            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::EDIT:
                if ($subject->getUser() !== $user && !$this->security->isGranted('ROLE_ADMIN')) {
                    return false;
                }
                if ($subject->getPicture() === null) {
                    return false;
                }
                if ($user->getVotes()->exists(function ($key, $vote) use ($subject) {
                    return $vote->getPicture() === $subject->getPicture();
                })) {
                    return false;
                }
                $numberOfMaxVoteForTheRelatedCompetition = $subject->getPicture()->getCompetition()->getNumberOfMaxVotes();
                $numberOfVotesFromTheUserForTheRelatedCompetition = $subject->getUser()->getVotes()->filter(function ($vote) use ($subject) {
                    return $vote->getPicture()->getCompetition() === $subject->getPicture()->getCompetition();
                })->count();

                if ($numberOfVotesFromTheUserForTheRelatedCompetition < $numberOfMaxVoteForTheRelatedCompetition) {
                    return true;
                }




                break;
            case self::VIEW:
                // logic to determine if the user can VIEW
                // return true or false
                break;
        }

        return false;
    }
}
