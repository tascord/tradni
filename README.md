# tradni
A NodeJs CLI Application &amp; Server allowing for controll of an IKEA Tradfri light.

### About tradni
tradni is a CLI application and server that allows you to controll your IKEA Tradfri lights.
I build this app purely to blink my light when a notification comes through on my laptop.

If you see any bugs, weird things, or want to suggest a feature, please [create an issue](https://github.com/tascord/tradni/issues/new/choose).

### Installing tradni
Make sure you've got [Node installed](https://no.de).

Run `npm install --global tradni`, make sure it's a global install, so you can use the `tradni` command.

Run `tradni gateway <your tradfri gateway's IP> <the gateways security code, found on the bottom>`

Once that's configured, run `tradni server` to get the server up and running, then `tradni list` to see all your installed lights.

Pick the light you want to mess with, and run `tradni select <light id>`.

Now mess around with all the tradni commands!

### Thank you <3
Thank you to [AlCalzone](https://github.com/AlCalzone) for creating the fabulous (and still maintained) [node-tradfri-client](https://github.com/AlCalzone/node-tradfri-client), which powers tradni.

Thank you to [Márton Papp / Morzzz0007](https://github.com/morzzz007) for creating (the now unmaintained) [node-tradfri](https://github.com/morzzz007/node-tradfri) which I borrowed code from to make the gateway set up not a pain.
