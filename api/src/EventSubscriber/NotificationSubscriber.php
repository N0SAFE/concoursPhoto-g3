<?php
// api/src/EventSubscriber/BookMailSubscriber.php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Repository\CompetitionRepository;
use App\Repository\UserRepository;
use App\Service\MailSender;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class NotificationSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserRepository $userRepository, private CompetitionRepository $competitionRepository, private MailSender $mailSender){
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendMail(ViewEvent $event): void
    {
        match ($event->getRequest()->attributes->get('_api_operation_name')) {
            "CompetitionCreate" => $this->onCompetitionCreate(),
            default => ""
        };
    }

    public function onCompetitionCreate() {
        $users = $this->userRepository->getAllUserByNotificationType(1);
        if ($users) {
            foreach ($users as $user) {
                $this->mailSender->sendMail("concoursPhoto@no-reply.com", $user->getEmail(), "Nouveau concours publié", "competition_published.html.twig", [
                    'mail' => $user->getEmail(),
                    'competitions' => $this->competitionRepository->getLastCompetitionPosted()
                ]);
            }
        }
    }

//    public function onCompetitionResult() {
//        $users = $this->userRepository->getAllUserByVotingDate(2);
//        if ($users) {
//
//        }
//    }
}