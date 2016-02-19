MyApp.angular.controller('LoginController', 
    ['$scope', '$http', '$window', 'BootService',
    function ($scope, $http, $window, BootService) { 
        
        console.log("LoginController")

        $scope.login = function (user) {
            if (user.name.length < 3) {
                alert('user name should be at least 3 character long!');
                return;
            }
            if (user.password.length < 4) {
                alert('password should be at least 4 character long');
                return;
            }

            $http.post('/api/login', {
                loginUsername: user.name,
                loginPassword: user.password
            }).success(function (data, status) {
                if (data.login == 'success') {
                    //$window.location.href = '/';
                    loginSuccess(user);
                }
                else if (data.login == 'fail') {
                    alert('Wrong user name or password!');
                }
                else {
                    var result = confirm('You want to create a new user: ' + user.name + '?');
                    if (result == true) {
                        $http.post('/api/register', {
                            registerUsername: user.name,
                            registerPassword: user.password
                        }).success(function (data, status) {
                            if (data.register) {
                                //$window.location.href = '/';
                                loginSuccess(user);
                            }
                            else {
                                altert('Register failed, please try again later!');
                            }
                        });
                    }
                }
            });
        }
        
        function loginSuccess(user) {
            MyApp.socket = io();
            MyApp.username = user.name;
            MyApp.fw7.app.closeModal();
            BootService.trigger('login');
        }

    /*
        function getIllegalUsernameSet() {
            var illegalUsernameArray = ['about', 'access', 'account', 'accounts', 'add', 'address',
                'adm', 'admin', 'administration', 'adult', 'advertising', 'affiliate', 'affiliates',
                'ajax', 'analytics', 'android', 'anon', 'anonymous', 'api', 'app', 'apps', 'archive',
                'atom', 'auth', 'authentication', 'avatar', 'backup', 'banner', 'banners', 'bin',
                'billing', 'blog', 'blogs', 'board', 'bot', 'bots', 'business', 'chat', 'cache', 'cadastro',
                'calendar', 'campaign', 'careers', 'cgi', 'client', 'cliente', 'code', 'comercial', 'compare',
                'config', 'connect', 'contact', 'contest', 'create', 'code', 'compras', 'css', 'dashboard',
                'data', 'db', 'design', 'delete', 'demo', 'design', 'designer', 'dev', 'devel', 'dir', 'directory',
                'doc', 'docs', 'domain', 'download', 'downloads', 'edit', 'editor', 'email', 'ecommerce', 'forum',
                'forums', 'faq', 'favorite', 'feed', 'feedback', 'flog', 'follow', 'file', 'files', 'free', 'ftp',
                'gadget', 'gadgets', 'games', 'guest', 'group', 'groups', 'help', 'home', 'homepage', 'host',
                'hosting', 'hostname', 'html', 'http', 'httpd', 'https', 'hpg', 'info', 'information', 'image',
                'img', 'images', 'imap', 'index', 'invite', 'intranet', 'indice', 'ipad', 'iphone', 'irc', 'java',
                'javascript', 'job', 'jobs', 'js', 'knowledgebase', 'log', 'login', 'logs', 'logout', 'list', 'lists',
                'mail', 'mail1', 'mail2', 'mail3', 'mail4', 'mail5', 'mailer', 'mailing', 'mx', 'manager', 'marketing',
                'master', 'me', 'media', 'message', 'microblog', 'microblogs', 'mine', 'mp3', 'msg', 'msn', 'mysql',
                'messenger', 'mob', 'mobile', 'movie', 'movies', 'music', 'musicas', 'my', 'name', 'named', 'net',
                'network', 'new', 'news', 'newsletter', 'nick', 'nickname', 'notes', 'noticias', 'ns', 'ns1', 'ns2',
                'ns3', 'ns4', 'old', 'online', 'operator', 'order', 'orders', 'page', 'pager', 'pages', 'panel',
                'password', 'perl', 'pic', 'pics', 'photo', 'photos', 'photoalbum', 'php', 'plugin', 'plugins',
                'pop', 'pop3', 'post', 'postmaster', 'postfix', 'posts', 'profile', 'project', 'projects', 'promo',
                'pub', 'public', 'python', 'random', 'register', 'registration', 'root', 'ruby', 'rss', 'sale', 'sales',
                'sample', 'samples', 'script', 'scripts', 'secure', 'send', 'service', 'shop', 'sql', 'signup', 'signin',
                'search', 'security', 'settings', 'setting', 'setup', 'site', 'sites', 'sitemap', 'smtp', 'soporte', 'ssh',
                'stage', 'staging', 'start', 'subscribe', 'subdomain', 'suporte', 'support', 'stat', 'static', 'stats',
                'status', 'store', 'stores', 'system', 'tablet', 'tablets', 'tech', 'telnet', 'test', 'test1', 'test2',
                'test3', 'teste', 'tests', 'theme', 'themes', 'tmp', 'todo', 'task', 'tasks', 'tools', 'tv', 'talk',
                'update', 'upload', 'url', 'user', 'username', 'usuario', 'usage', 'vendas', 'video', 'videos', 'visitor',
                'win', 'ww', 'www', 'www1', 'www2', 'www3', 'www4', 'www5', 'www6', 'www7', 'wwww', 'wws', 'wwws', 'web',
                'webmail', 'website', 'websites', 'webmaster', 'workshop', 'xxx', 'xpg', 'you', 'yourname', 'yourusername',
                'yoursite', 'yourdomain'];
            var illegalUsernameSet = new Set(illegalUsernameArray);
            return illegalUsernameSet;
        }
    */
    
    }]
);