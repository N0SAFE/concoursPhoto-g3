<?php

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class MailSender
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendMail($from, $to, $subject, $pathname, $context = [])
    {
        $email = (new TemplatedEmail())
            ->from($from)
            ->to(new Address($to))
            ->subject($subject)

            // path of the Twig template to render
            ->htmlTemplate(sprintf('mails/%s', $pathname))

            // pass variables (name => value) to the template
            ->context($context);

        $this->mailer->send($email);
    }
}
