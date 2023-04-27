
# MQTT Chat

Cette application a été developpé en React JS, et utilise la technologie MQTT via le brocker HiveMQ afin de créer un chat.

## Fonctionnalités

### Login avec un username (unique)
Pour permettre l'identifiant unique, nous avons utilisé le nom d'utilisateur comme clientID lors de la connection au serveur MQTT

### Chat général
Lors de la connexion de l'utilisateur, il souscrit automatiquement au chat général, et il lui est donc possible de publier des messages et d'en recevoir.
Il n'est pas possible de quitter le canal général.

### Création d'un canal de discussion
Pour la création d'un canal de discussion, il suffit à l'utilisateur de créer un topic, celui-ci va de ce fait souscrire à celui-ci, et pouvoir le sélectionner dans la liste.
Pour qu'un autre utilisateur se joigne à lui, il lui faudra crééer ce même topic de son coté.

### Inviter des utilisateurs et discuter en one to one
L'invitation des utilisateurs est liée à la fonction oneToOne. 
Lors de la connexion de l'utilisateur, il souscrit à un canal : oneToOne/#, ce qui va lui permettre de recevoir les invitations.

Lorsqu'un utilisateur clic sur le nom d'un autre, il souscrit à un canal : oneToOne/${name}/${user}, ce et publie un message d'invitation.

Les autres utilisateurs reçoivent alors ce message, et si le nom correspond, il souscrivent au canal et publie alors que la demande a été acceptée.

### Quitter un canal
Il n'est pas possible de quitter le canal General.
Pour quitter les autres canaux, il suffit de cliquer sur 'Leave'. Cela met alors simplement fin à la souscription du canal en question pour l'utilisateur, et le renvoie sur le canal 'General'.

## Commandes

Les commandes utilisées sont :

### Subscribe : 
Cette commande permet à l'utilisateur de s'abonner à un sujet, et ainsi de recevoir les mises à jour de celui-ci.

#### Unsubscribe : 
Cette commande permet à l'utilisateur de se désabonner d'un sujet, et ainsi de ne plus recevoir de mises à jour de celui-ci.

#### Publish(topic, message) : 
Cette commande permet à l'utilisateur de publier un message dans le canal auquel il est abonné.

#### On(Connect) : 
Cette commande permet d'effectuer des actions lors de la connection au brocker, notamment souscrire directement au canal général.

#### On(Error) : 
Permet d'effectuer une action lorsqu'il y a un problème avec le brocker.

#### On(Close) : 
Permet d'effectuer un action lorsque la connection avec le brocker est fermée.

#### End : 
Permet de mettre fin à la connection avec le brocker.


## Installation

Installation des dépendances : `npm i`

Lancement du programme : `npm start`
