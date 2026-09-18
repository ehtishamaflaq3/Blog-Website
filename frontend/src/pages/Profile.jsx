import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userLogo from "../assets/user.jpg";
import React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { Button } from "@base-ui/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  return (
    <div className="h-156 border-gray-700">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="flex md:flex-row flex-col gap-10 p-10 md:p-9 dark:bg-gray-800 mx-4 md:mx-0">
          {/* Image Section */}
          <div className="h-full flex flex-col gap-5 items-center justify-center md:w-[350px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={userLogo} />
            </Avatar>
            <h1 className="text-3xl font-bold ">Mern Stack Developer</h1>
            <div className="flex gap-4">
              <Link>
                <FaFacebook className="size-11" />
              </Link>
              <Link>
                <FaLinkedin className="size-11" />
              </Link>
              <Link>
                <FaGithub className="size-11" />
              </Link>
              <Link>
                <FaInstagram className="size-11" />
              </Link>
            </div>
          </div>
          {/* info section */}
          <div className="flex flex-col border-2 p-2 w-full">
            <h1 className="font-bold text-center  ml-5 text-4xl mb-7">
              WelCome User !
            </h1>
            <p className="text-2xl">
              <span className="ml-5 font-semibold text-2xl ">Email : </span>
              ehtishamaflak@gmail.com
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-4">
              <label className="text-2xl ml-5 font-semibold">About Me</label>
              <p className="border dark:border-gray-600 p-7 m-2 text-xl text-start rounded-lg">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Impedit consequuntur aliquid tempora odit illo provident
                architecto laboriosam repellendus dolorem delectus
              </p>
            </div>

            {/* making dialog */}
            <Dialog>
              <form>
                <DialogTrigger
                  render={
                    <Button className="h-14 px-4 rounded-2xl text-lg font-bold md:ml-80 bg-black cursor-pointer text-white border-4 w-[24%] border-gray-400 hover:bg-gray-500 hover:text-gray-800">
                      Edit Profile
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-sm border-4 border-gray-400 w-[35%]">
                  <DialogHeader className="text-center">
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  {/* name */}
                  <FieldGroup className="flex flex-row">
                    <Field>
                      <Label htmlFor="firstname-1">First Name</Label>
                      <Input
                        id="firstname-1"
                        name="firstname"
                        type="text"
                        placeholder="Write First Name..."
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="lastname-1">Last Name</Label>
                      <Input
                        id="lastname-1"
                        name="lastname"
                        type="text"
                        placeholder="Write Last Name..."
                      />
                    </Field>
                  </FieldGroup>
                  {/* facebook Instagram section */}
                  <FieldGroup className="flex flex-row">
                    <Field>
                      <Label htmlFor="facebook-1">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        placeholder="Enter a URL..."
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="instagram-1">Instagram</Label>
                      <Input
                        id="instagram-1"
                        name="instagram"
                        placeholder="Enter a URL..."
                      />
                    </Field>
                  </FieldGroup>
                  {/* Github Linkedin */}
                  <FieldGroup className="flex flex-row">
                    <Field>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        placeholder="www.linkedin.com"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="github">Github</Label>
                      <Input
                        id="github"
                        name="github"
                        placeholder="www.github.com"
                      />
                    </Field>
                  </FieldGroup>
                  {/* description */}
                  <Label>Description</Label>
                  <Textarea
                    className="col-span-1 text-gray-500"
                    placeholder="Enter Description here..."
                  />
                  {/* Picture */}
                  <Label>Picture</Label>
                  <input
                    className="border-4 h-12 text-center"
                    type="file"
                    name="pic"
                    id="pic"
                  />
                  {/* footer form section */}
                  <DialogFooter className="border-4 ">
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
