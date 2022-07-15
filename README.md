Repository del progetto finito del corso di Ingegneria del Software, VI semestre, anno 2022, Ingegneria Informatica, delle Comunicazioni ed Elettronica.

# Sezione introduttiva

### Membri del team:
* Biffis Nicola (209280) - @nicovii
* Pavan Stefano (209086) - @Stevexx22
* Trevisi Davide (209229) - @davidetrevisi

### Idea di progetto:
Un semplice negozio online che implementi diversi utenti con diverse funzionalità specifiche del ruolo

### Link:
* Repository contenente la UI con VueJs: [LINK](https://github.com/davidetrevisi/local_shop_advisor_Vue)
* Repository per l'hosting del frontend: [LINK](https://github.com/davidetrevisi/local_shop_advisor_Hosting)
* Apiary: [LINK](https://localshopadvisor.docs.apiary.io)
* Heroku (backend): [LINK](https://local-shop-advisor.herokuapp.com/), non funziona perché il backend non presenta interfaccia grafica
* GitHub Pages (frontend): [LINK](https://davidetrevisi.github.io/local_shop_advisor_Hosting/).

**NOTE**: 
* necessita di avere abilitati i cookie di terze parti nel browser. 
* il backend su heroku dopo un certo periodo di tempo in cui non ci sono chiamate si spegne. Quando si accede nuovamente al sito e si chiamano le api il backend si risveglia con la condizione iniziale, ovvero senza le immagini salvate. Non siamo riusciti ad ovviare a questa cosa, per questo motivo non ci saranno prodotti e negozi già presenti.
* il sito supporta l'inserimento di immagini multiple (max 6) di tipo .png, .jpeg, .jpg.
* per inserire i tag basta scrivere nella casella e premere invio, per eliminarli basta cliccare sull'icona con la "x".
* il sito non supporta la verifica di tutti i parametri inseriti, cercare di essere coerenti al contenuto (es. un numero di telefono non ha lettere).
* se ci fossero problemi vi abbiamo dato accesso al backend e al database in cloud.

**CREDENZIALI**:

Cliente (email: cliente, pw: cliente), Venditore (email: venditore, pw: venditore), Admin (email: admin, pw: admin). L'account Admin serve sostanzialmente per chiamare le API della gestione degli account, visto che non ha le funzionalità implementate nel frontend.

# Sezione generale

### Organizzazione repository:
File quali documentazione (swagger.yaml), index.js e altri file di sviluppo sono nella cartella pricipale. I file delle API sono nella cartella app/, assieme al file app.js contenente le route. I modelli e gli schemi sono nella cartella app/models/.

### Strategia di branching:
Gitflow Workflow (un branch principale, un branch develop dove fare il merge delle branch di ogni macro-feature).

### Product backlog:
[LINK](https://docs.google.com/spreadsheets/d/1sMuoLFgLgSmtULP6AxpdrclH2YbPDenj5oKhhYiH6Zk/edit?usp=sharing)

### Definizione di "done":
I task sono considerati conclusi quando:
* I criteri della user story sono stati rispettati
* Il codice è stato adeguatamente commentato
* Il codice è stato testato brevemente dallo sviluppatore per evitare errori grossolani
* È stato effettuato il commit del codice nel branch appropriato

# Sezione Sprint 1 

### Goal: 
L'obiettivo di questo sprint è creare lo scheletro del progetto, con grafica basilare, che funzioni in locale: in particolare è importante inserire tutte le parti essenziali del backend (anche se con schemi in Mongoose e metodi REST non presenti o non completi), per poi espandere e definire il tutto nel secondo sprint.
Essendo tutti i componenti del gruppo nuovi a questo tipo di sviluppo e di linguaggi, ci sarà inizialmente una parte sostanziale dedicata allo studio di JavaScript e MongoDB.

### Sprint planning:
[LINK](https://docs.google.com/spreadsheets/d/1sMuoLFgLgSmtULP6AxpdrclH2YbPDenj5oKhhYiH6Zk/edit?usp=sharing)

Il meeting si è svolto nei tempi prestabiliti. I membri del team erano quasi completamente d'accordo sulle stime e sulle tasks previste, a parte alcune tasks slegate dalle user stories ma necessarie ai fini del progetto (quali inizializzazione dell'ambiente di sviluppo, delle repository, configurazione dei software necessari) che sono state aggiunte per ultime.

### Test cases:
[LINK](https://docs.google.com/spreadsheets/d/1sMuoLFgLgSmtULP6AxpdrclH2YbPDenj5oKhhYiH6Zk/edit?usp=sharing) 

### Sprint review:
Effettuato prima del previsto, poiché molte tasks si sono rivelate essere sovrastimate ed è stato necessario ridefinire le tempistiche, aggiungere nuove tasks e user stories allo sprint e rivedere lo sprint backlog. In generale il team è molto soddisfatto di come si è svolto questo primo sprint

### Product backlog refinement:
Nel corso dello sprint review il team ha ritenuto necessario aggiungere alcune user stories che inizialmente non si pensava fosse possibile realizzare nei tempi definiti dai docenti. Sono state integrate nel product backlog e nello sprint backlog con rispettive tasks.

### Sprint retrospective:

Nei primi giorni il planning sembrava essere stato fatto correttamente perché le ore di studio e di progettazione corrispondevano quasi completamente, successivamente ci siamo resi conto che molte tasks avevano stime troppo elevate (poiché erano simili a tasks già finite oppure avevamo familiarizzato i linguaggi) e abbiamo scelto di modificare le tempistiche aggiungendo ulteriori user stories che non avevamo preventivato di riuscire a completare in questo sprint. In generale non ci sono stati grossi problemi con l'organizzazione del progetto, ma c'è stata qualche difficoltà con l'utilizzo di GitHub legate alla poca esperienza del team, in particolare nello stashing delle modifiche in locale perché qualche membro del team in remoto aveva effettuato dei commit.

# Sezione Sprint 2

### Goal:
L'obiettivo di questo sprint è concludere definitivamente il backend e finire l'interfaccia grafica con VueJs.

### Sprint planning:
[LINK](https://docs.google.com/spreadsheets/d/1sMuoLFgLgSmtULP6AxpdrclH2YbPDenj5oKhhYiH6Zk/edit?usp=sharing)

Data l'esperienza con il primo meeting, questo si è svolto più linearmente e velocemente del precedente. Sono stati discussi tutti i vari elementi da inserire nel backlog e in particolare su quali aree del frontend focalizzarsi maggiormente.

### Test cases:
[LINK](https://docs.google.com/spreadsheets/d/1sMuoLFgLgSmtULP6AxpdrclH2YbPDenj5oKhhYiH6Zk/edit?usp=sharing)

È stato necessario diminuire il numero di test cases dall'elenco stilato nello sprint precedente poiché durante lo sviluppo ci siamo accorti che non è stato possibile in tutti i casi implementare in Jest, oppure erano test cases legati al frontend.

### Sprint review:
Non ci sono stati troppi rimaneggiamenti dello sprint backlog quindi abbiamo concluso di aver pianificato correttamente lo sprint. Il team concorda che qualche task poteva essere espansa (per esempio le API con una gestione più approfondita degli errori) ma per questione di tempistiche non è stato possibile.

### Product backlog refinement:
Il team ha deciso di aggiungere la gestione degli ordini (acquisto, modifica ordini, visualizzazione ordini, visualizzazione storico ordini) all'applicazione verso metà sprint, quindi è stato necessario espandere lo sprint backlog con le informazioni richieste. Le task restanti sono state rimodulate per integrare le nuove aggiunte.

### Sprint retrospective:
Nonostante l'aggiunta della gestione degli ordini a metà sprint abbia portato a non finire alcune task esistenti, il team è soddisfatto della pianificazione e della scelta effettuata perché gli ordini sono stati ritenuti di maggiore importanza. È stata riscontrata qualche difficoltà da parte del team nello sviluppo della UI con VueJs poiché nessuno dei componenti aveva mai fatto utilizzo di questo framework. Nonostante non fosse richiesto ai fini della valutazione del progetto, abbiamo deciso comunque di provare a sviluppare la nostra interfaccia grafica in questo modo per imparare ad usare un nuovo strumento.

# Sezione finale

### Diagrammi e note techiche:
Il backend dell'applicazione è istanziato su [Heroku](https://local-shop-advisor.herokuapp.com/) (non funziona perché il backend non presenta interfaccia grafica) connesso a MongoDB su cloud. L'interfaccia grafica con VueJs è istanziata su [GitHub Pages](https://davidetrevisi.github.io/local_shop_advisor_Hosting/).

Continuous Integration e Continuous Delivery nel backend sono gestiti tramite GitHub Actions, che testano il codice con il tool Jest e i file di test corrispondenti. Se non ci sono errori si procede al deploy su Heroku. Il frontend è manualmente istanziato (push nella repository di hosting da linea di comando) e deployato tramite GitHub Actions nelle GitHub pages.

#### Stack tecnologico
##### Librerie backend:
* node
* express
* mongoose
* multer (Gestione delle immagini)
* jsonwebtoken
* cookie-parser
* cors
* dotenv
* jest (testing)
* supertest (testing)

##### Librerie frontend:
* cors
* vue
* vue-router
* vite
* vitejs
* vue2-google-maps
* @fawmi/vue-google-maps

Per le Mappe di Google utilizziamo le funzioni dei moduli sopra elencati, non le chiamate dirette alle API.

**MongoDB** come database non relazionale per il backend, **VueJs** framework per il frontend

### Conclusioni:

Il progetto è stata una forte spinta verso la programmazione "aziendale" vera e propria che non avevamo mai sperimentato prima d'ora. Guardando il progetto al suo stato attuale dobbiamo dire di essere molto contenti del risultato, anche se ci sono alcune parti che potrebbero essere state sviluppate meglio o migliorate (per esempio un feedback all'utente nel frontend di ciò che si sta facendo, visto che ora come ora non ha messaggi di errore a schermo, oppure un migliore controllo degli input nei form di inserimento), ma nel complesso la maggior parte del lavoro prefissato è stata svolta.
La linea di sviluppo agile inizialmente ci ha dato dei problemi, ma poi prendendoci la mano è come se avessimo dei compiti da portare a termine: questo può essere sia uno stimolo al lavoro che un punto critico poiché si rischia il burnout per stare al passo con il programma se non si pianifica in modo corretto. Come prima esperienza non ci siamo trovati male, e sicuramente la parte di pianificazione del lavoro ha certamente aiutato a focalizzarci sui punti veramente fondamentali del progetto.
