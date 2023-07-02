<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Repository\CompetitionRepository;
use App\Repository\NotificationTypeRepository;
use App\Repository\UserRepository;
use App\Service\MailSender;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class NotificationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private CompetitionRepository $competitionRepository,
        private MailSender $mailSender,
        private NotificationTypeRepository $notificationTypeRepository
    ) {
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
            'CompetitionCreate' => $this->onCompetitionCreate(),
            default => '',
        };
    }

    // @TODO à revoir car il ne sert plus à grand chose mais si on veut se baser dessus par exemple pour les notifs sur les inscriptions
    public function onCompetitionCreate()
    {
        //        $notificationType = $this->notificationTypeRepository->findOneBy(["notification_code" => 1]);
        //        $users = $this->userRepository->findByNotificationType($notificationType);
        //        if ($users) {
        //
        //        }
    }
}
