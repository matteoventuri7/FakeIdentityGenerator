const $completeName = document.getElementById('completeName');
const $email = document.getElementById('email');
const $piva = document.getElementById('piva');
const $cf = document.getElementById('cf');

document.getElementById('generate').addEventListener('click', ResetIdentityStored);
document.querySelectorAll('.copy-it').forEach((e) => e.addEventListener('click', Copy));

function ResetIdentityStored() {
    localStorage.removeItem('fakeIdentityStored');
    GenerateNewIdentity();
}

function IsDataStored() {
    return localStorage.getItem('fakeIdentityStored') !== null;
}

function GenerateNewIdentity() {
    let completeName, email, piva, cf;

    if (!IsDataStored()) {
        completeName = faker.name.findName();
        email = faker.internet.email();

        let pg = new ITVatGV();
        piva = pg.generate();

        cf = CodiceFiscale.compute({
            name: "Matteo",
            surname: "Venturini",
            gender: "M",
            day: 12,
            month: 2,
            year: 1976,
            birthplace: "Cesena", 
            birthplace_provincia: "FC"});

        localStorage.setItem('completeName', completeName);
        localStorage.setItem('email', email);
        localStorage.setItem('piva', piva);
        localStorage.setItem('cf', cf);

        localStorage.setItem('fakeIdentityStored', new Date().getTime());
    } else {
        completeName = localStorage.getItem('completeName');
        email = localStorage.getItem('email');
        piva = localStorage.getItem('piva');
        cf = localStorage.getItem('cf');
    }

    $completeName.innerText = completeName;
    $email.innerText = email;
    $piva.innerText = piva;
    $cf.innerText = cf;
}

function Copy(event) {
    event.preventDefault();

    const inp = document.createElement('input');
    document.body.appendChild(inp)
    inp.value = event.target.innerText;
    inp.select();
    document.execCommand('copy', false);
    inp.remove();

    NotifyUser('Fake Identity Creator', 'Copied!');
}

function NotifyUser(title, msg) {
    let options = {
        type: "basic",
        title: title,
        message: msg,
        iconUrl: "icon.png"
    };

    chrome.notifications.create("FakeIdentityCreatorNotification", options, function(){
        setTimeout(function(){
            chrome.notifications.clear("FakeIdentityCreatorNotification");
        }, 2000);
    });
}

GenerateNewIdentity();