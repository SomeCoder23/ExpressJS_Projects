# How to deploy your nodejs project to AWS:

1) Make sure your nodejs project is working, cd into the folder. Make sure you have a dist folder with the index.js file and an infrastucture folder with an app.service file with the code for running the service on systemd, as shown in the following image:

![1st step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-16-58.png)

2) Compress the dist folder as well as the package.json and package-lock.json files with the command `tar czvf app.tar.gz package.json package-lock.json dist/*` 

![2nd step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-19-56.png)

3) Go to your github repo on the website, then go to release and click on "Draft a Release". Fill in the fields and add the compressed file in the binary files section. Then click "Publish Release"

![3rd step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-21-49.png)

4) Now go to the aws website login to your account, go to EC2 launch templates and click "Create Launch Template". Fill in the required fields.

![4th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-23-48.png)

Choose "Quick Start", then "Ubuntu". For the instance type choose "t2.micro".

![5th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-24-46.png)

If you have already created a key pair and you have it downloaded choose it, otherwise create a new one. Once you create it, it will download the private key, move it to a secure folder and change its permisions so only you can read it using the command `chmod 400 yourPrivateKey.pem`.
And now with the security group, if you have one ready choose it (skip the next part) otherwise create a new one. 

![6th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-25-47.png)

**If you don't have a security group open a new tab, go to your aws account, then EC2 security groups and click "Create Security Group".
Set a name for your security group, then set the inbound and outbound rules as shown in the image below:

![12th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-43-12.png)

![13th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-43-24.png)

Click on "Create security group". Go back to your main tab (the one where you're creating the launch template), click on the refresh icon next to the security groups dropdown then choose the security group you just created.
Go down to the 'User Data' textfield in the Advanced settings and paste your shell script. In my case its:
```
#!/bin/sh
set -e

sudo apt update
sudo apt upgrade -y

# install nodejs repo
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install nodejs jq curl -y

# create app & github users
sudo useradd --system --create-home --shell /usr/sbin/nologin app
sudo useradd -g app --no-create-home --no-user-group --home-dir /home/app --shell /bin/bash github
sudo usermod --append --groups app github

# deploy app
repo="SomeCoder23/ExpressJS_Projects"
download_url=$(curl "https://api.github.com/repos/$repo/releases/latest" | jq --raw-output '.assets[0].browser_download_url')
asset_name=$(curl "https://api.github.com/repos/$repo/releases/latest" | jq --raw-output '.assets[0].name')

curl -O "https://raw.githubusercontent.com/$repo/main/BookAPI/infrastructure/app.service"
sudo mv app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable app.service

sudo -u app sh -c "mkdir -p /home/app/app && cd /home/app/app && curl -LO $download_url && tar xzvf $asset_name && npm install --omit=dev"

sudo systemctl start app.service
```

![7th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-26-40.png)

Then click "Create launch template". And now we're done with that part :)

5) Go to Target Groups and click "Create target group", fill in the following fields. Fill in the health path according to the path you have added in your index.js file for health checking.
![8th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-31-55.png)

![9th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-32-17.png)

Click "Create". Now we have create a target group, on to the load balancer :)

6) Go to Load Balancers and click "Create Load Balancer", then choose the application load balancer. Set a name and choose the availability zones.
Either choose an existing security group or create a new one. TO create a new one follow the next steps.

![10th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-36-58.png)

As we did before open a new tab and go to security groups then click on "Create Security Group". Set a name for the group, then set the outbound rules the same as before and the inbound rules as follows:
![14th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-46-30.png)

Click create then go back to your main tab. After you've selected your security group go to the next step and choose the target group you created before. Then click next for the following steps and create the load balancer.
![11th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-37-54.png)

7) Now go to Auto-scaling groups and click create. Enter a name for the group, choose the launch template you created earlier then choose the latest version. Click next.
![17th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-49-23.png)

Choose the availability zones. Click next.
![18th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-50-02.png)

Choose "Attach to an existing load balancer", then choose your target group. Click next.
![19th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-50-34.png)

Choose your prefered group size, and the min/max capacity.
![20th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-52-42.png)

For the scaling policies either choose none or "Target tracking scaling poilicy", of you chose the latter configure the scaling policy to your preference, in my case I set it to use the Average CPU utilization metric of value 60. Pass through the next steps then click create.
![21th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2019-53-00.png)

8) After a few minutes, go to your instances and make sure that your new instances are running and healthy, then go to your load balancer and copy it's DNS, then past it into the browser.
![22th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2020-05-23.png)

And voilaa there you have it! You successfully deployed your app to aws :)
![23th step](https://github.com/SomeCoder23/ExpressJS_Projects/blob/main/Screenshots/Screenshot%20from%202023-08-20%2020-05-46.png)


