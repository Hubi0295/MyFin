### **Projekt dostępny jest również na Github: https://github.com/Hubi0295/MyFin**


# Nazwa projektu - MyFin

# Tematyka projektu

Aplikacja zbudowana według wzorca MVC wspomagająca zarządzanie finansami- budżet domowy oraz inwestycje.

# Autor
Hubert Szelepusta

# Funkcjonalności

- **Rejestracja z linkiem aktywacyjnym, logowanie oraz edycja konta**
- **Dodawanie, edycja oraz usuwanie wydatków**
- **Dodawanie, edycja oraz usuwanie przychodów**
- **Wizualizacja danych poprzez wykresy kołowe, liniowe, polarne, kolumnowe**
- **Dodawanie, edycja oraz usuwanie kosztów inwestycji**
- **Dodawanie, edycja oraz usuwanie zysków z inwestycji**
- **Wyszukiwanie z filtrowaniem transakcji**
- **Sortowanie transakcji**
- **Dostęp do saldo konta**
- **Zmiana motywu na jasny/ciemny**
- **Podsumowanie wydatków oraz przychodów, kosztów oraz zysków z inwestycji**

# Narzędzia i technologie:


**Backend**: Laravel, Breeze


**Frontend**: Vite, React, Tailwind


**Baza danych**: SQLite


**Inne**: Inertia, Chart.JS


# Wymagania
*PHP: 8.2*


*Composer: 2.8.3*


*Laravel: 11.31*


*React: 18.2.0*


*Tailwind:3.2.1*


*ChartJs: 4.4.7*


*Vite: 6.0*


*Node: 22.12*


*Git: 2.39.1*


*SQLite: 3.26.0*


# Instalacja
*Polecany przez mnie sposób instalacji wymaganych bibliotek, testowane na czystej maszynie wirtualnej:*


**Ważne jest sprawdzenie poprawności dodania zmiennych środowiskowych PATH!**


### 1.
Instalacja php, laravel, composer:  


Windows:


komenda windows powershel w trybie administratora:  

```bash
*Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))*
```

Linux:

```bash
*/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"*
```

### 2.
Instalacja Node ze strony: ```bash https://nodejs.org/en ```


### 3.
Instalacja ChartJS: ```bash npm install chart.js ```
Link do strony:  https://www.chartjs.org/docs/latest/getting-started/installation.html


### 4.
Instalacja Git: 

```bash
https://git-scm.com/downloads/win
```


### 5. WAZNE !!
Po zainstalowaniu wszystkich potrzebnych komponentów należy w wierszu poleceń wykonać następujące polecenia:

```bash
composer install  - instalacja composer do projektu


npm install  - instalacja zależności z pliku package.json


copy .env.example .env - utworzenie pliku konfiguracyjengo


php artisan key:generate - generuje nowy klucz aplikacji i zapisuje go do pliku .env 


php artisan migrate –-seed - Utworzenie tabel oraz stworzenie testowego konta i wypełnienie go losowymi transakcjami


yes - Utworzenie bazy danych
```

# Uruchomienie
Na koniec wystarczy otworzyć dwa terminale i wykonać 2 polecenia:

```bash
**npm run dev** - start serwera Vite
```
```bash
**php artisan serve** - start serwera Laravel
```

W Przeglądarce otworzyć: **http://127.0.0.1:8000/login**

# Uwagi
Jeśli serwer nie startuje po kilku próbach na różnych portach, w odpowiednij wersji pliku php.ini zmienić variables_order = "GPCS".
Wesje używanego php do namierzenia pliku php.ini można sprawdzić komendą php –i 


Po zarejestowaniu nowego użytkownika link aktywacyjny konta jest wysłany mailowo. 
Ustawiono kanał do wysyłania wiadomości jako Logger więc link znajduje się w storage>logs>laravel.log 


# Konto testowe utworzone po migracji
Login: hubert123@example.com


Hasło: password@123 
