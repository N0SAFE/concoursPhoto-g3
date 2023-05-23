<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;

class UserSatisfyCompetitionCriteria
{
    public function __construct(private MailerInterface $mailer)
    {
    }

    public function verify(Competition $competition, User $user): bool
    {
        return true;
    }
}
